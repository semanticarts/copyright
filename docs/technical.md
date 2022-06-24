# Technical

## Structure

The project uses a CLI as the interface. That CLI is defined in the top level `cli` folder. The commands that are used are defined in `cli/commands`. They both use the same handler, since they are really just part of the configuration passed into the running.

The command becomes the `Command` enum, defined in `./types.ts`. The existence of the `--recursive` flag becomes the `Mode` enum, either `Mode.Recursive` or `Mode.Selective`.

After the command is parsed, the config object is searched for. This is defined in the `config/config.ts` file, which exports the resolution of a function which looks for and builds a config object. That config object is validated while it is being built from the config presented by the user.

The config top level is validated by `config-builder.ts`, and the rules are each validated by `rule-builder.ts`. Looking at the test files `config-builder.test.ts` and `rule-builder.test.ts` gives a good indication of what the config does and does not support.

After the config object has been constructed, the main script is in `copyright.ts`. This first determines the files to run on by using the `Mode` to recursively search (or not) for files. After the files have been collected, each of them runs through a `testFile()` function, which is the meat of the copyright operation.

The `testFile/` directory includes `testFile.ts`, which is where that function is.

## The strategy for testing a file

The strategy that this package takes to making sure every file has the correct contents is by defining a _structure_. That structure is really just a series of optional regex capture groups, each corresponding to something different. Those regex capture groups are named (which will be explained later) and then pieced together (depending on some options) into a final regex. That construction happens in the `generateRegex()` function.

Whether those named regex capture groups match anything indicate which parts of the file are there. For example, if a capture group named `prefix_prefix` is NOT matched, it means that the prefix of a file was not there.

The naming scheme of a regex capture group has three components, called the name, the salt, and the block. An example of a regex capture group name is `newline987678_prefix`. This has name `newline`, salt `987678`, and block `prefix`.

The name is used to find a _default_. For regex capture groups that have name `newline`, this default is a `\n` character. That means if the regex capture group is EMPTY, the file was MISSING a newline in that location. The salt is the least interesting. It is just present because we can't name multiple capture groups `newline_prefix`, even if we'd like to. The block of the regex capture group is, generally, _what the regex capture group belongs to_. For example, for `newline987678_prefix`, it's a newline belonging to the prefix of a file.

As an example, consider a file `test.txt` that begins as

```txt
<><> my prefix <><>
License of Semantic Arts, 2018 - 2022

The beginnings of the file...

...
```

where the extension rule has a `prefix` property of `"<><> my prefix <><>"` and a copyright property of `"License of Semantic Arts, 2018 - {{{currentYear}}}"`. This file is _missing_ a newline between the prefix line and the copyright line. That means a regex capture group like `newline987678_prefix` would be _empty_.

After we identify the various groups that are missing, we can reconstruct the file using the matched regex capture groups (if they exist), or the defaults (if they don't). That reconstruction happens in the `reconstructFileFromStructure()` function, which is probably the most complex in the project. Essentially what it does is look through all named capture groups of the regex, and makes decisions based on its name, its block, and the command.

The reason the block exists on a capture group name is because if the prefix is defined and the option `forcePrefixOrSuffix` is true, we want to enforce capture groups ending in `_prefix`, but if that option is false, we DON'T want to enforce those groups. We essentially just need a way of telling which capture group belongs to what part of a file, using the capture group name.

The only complex bit comes from using positive lookaheads and non-greedy capturing groups for matching content (matched with the regex `/[\s\S]*/`, which matches EVERYTHING) and the bottom-placed copyrights, but that just takes some experimenting.

## License

- Copyright © 2018 - 2022 by Semantic Arts LLC
- Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
