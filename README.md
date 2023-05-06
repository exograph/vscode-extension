# How to use

Run `npx @vscode/vsce package` to build the extension. Then install it in VSCode by running `code --install-extension exograph-0.0.1.vsix`.

# Development

## Organization

* `package.json` - this is the manifest file that declares the Exograph language support as well as contributions to other languages (markdown).
* `src/syntaxes/exograph.tmLanguage.template.json` - this is the Text mate grammar file that is used for tokenization. It contains a few placeholders that will be filled in by the build script (./build.js).
* `src/language-configuration.json` - this is the language configuration, defining the tokens that are used for comments and brackets.

## Debugging the extension

1. Then press the "Debug" button (the triangle on the left side) or Press `F5` to open a new window with your extension loaded. Then run the extension.
2. In the window opened by the debugger, open `example.exo`, `example.md`, and `example.exotest` to check the syntax highlighting.

## Making changes

1. Run `npm run build` every time you change the `exograph.tmLanguage.template.json` file.
2. You can relaunch the extension from the debug toolbar after making changes to the files listed above.
3. You can also reload (`Ctrl+R` or `Cmd+R` on Mac) the VS Code window with your extension to load your changes.

Tip: `View` -> `Command Palette` -> `Developer: Inspect Editor Tokens and Scope` is a very useful tool. It will bring up a palette and as you click around an example file, it will show matching scopes.
