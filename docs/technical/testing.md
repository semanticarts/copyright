# Testing

## Philosophy

There is an emphasis on unit tests, since they are easier to write/maintain and rely less on the build process. The CLI is still tested, but not to the extent that the code that runs directly underneath the CLI is tested.

That is, the CLI is tested that it works and shows error messages correctly, but the code underneath is tested much more stringently for completeness and correctness.

## Coverage

There isn't much to say. There are some issues with coverage, however. It is hard to get coverage on an app that gets compiled, because the CLI is tested as the transpiled javascript, and not the Typescript that is written.

For that reason, the coverage report when running `npm test` shows that the entire `src/cli` directory is untested, when in reality, it isn't. It is covered (at least partially) by the `cli.test.ts` file. I'm not sure how to solve this issue

## License

- Copyright © 2018 - 2023 by Semantic Arts LLC
- Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
