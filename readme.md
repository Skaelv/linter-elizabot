![linter-rory Atom package](linter-rory.gif)

# linter-rory

[**Atom**](https://atom.io) [**linter**](https://github.com/AtomLinter/Linter) meets [**rory**](https://github.com/Shopify/rory) to enforce Shopify content style.

**linter-rory** is an Atom package that uses [**rory**](https://github.com/Shopify/rory) to check for style errors according to the [**retext-styleguide**](https://github.com/Shopify/retext-styleguide) ruleset.

## Install linter-rory in Atom

Installing the takes a few steps in your terminal.

### Install the base linter

Most linters depend on a "base" linter package that provides general line highlighting and error message functionality.

1. Open a terminal session.
2. Type `cd ~/.atom/packages` to get to your local Atom packages folder.
3. Type `apm install linter` to install the base linter package.

### Install the rory linter

From the same folder:

1. Type `git clone git@github.com:Shopify/linter-rory.git` to clone the repository for the linter package.
2. Type `cd linter-rory` to get to the package folder.
3. Type `apm install` to install **linter-rory**'s dependencies.

The next time you launch Atom, the package **linter-rory** should be active, and your Markdown and HTML files should be linted according to Shopify style.

## Contributing

Raise issues for the Atom plugin in [this repository](https://github.com/Shopify/linter-rory/issues).
Raise issues with **rory** in [its repository](https://github.com/Shopify/rory).
The styleguide ruleset is in the [retext-styleguide repository](https://github.com/Shopify/retext-styleguide).
