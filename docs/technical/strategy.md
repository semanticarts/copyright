# Strategy for ensuring a file's correctness

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

- Copyright © 2018 - 2023 by Semantic Arts LLC
- Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
