# Structure of the project

The project uses a CLI as the interface. That CLI is defined in the top level `cli` folder. The commands that are used are defined in `cli/commands`. They both use the same handler, since they are really just part of the configuration passed into the running.

The command becomes the `Command` enum, defined in `./types.ts`. The existence of the `--recursive` flag becomes the `Mode` enum, either `Mode.Recursive` or `Mode.Selective`.

After the command is parsed, the config object is searched for. This is defined in the `config/config.ts` file, which exports the resolution of a function which looks for and builds a config object. That config object is validated while it is being built from the config presented by the user. We use the `zod` package for validation.

After the config object has been constructed, the main script is in `copyright.ts`. This first determines the files to run on by using the `Mode` to recursively search (or not) for files. After the files have been collected, each of them runs through a `testFile()` function, which is the meat of the copyright operation.

The `testFile/` directory includes `testFile.ts`, which is where that function is. It is the meat of the package, described in `strategy.md`.
