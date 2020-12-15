# Git scraper 

[![Package Version][package-image]][package-url]
[![Open Issues][issues-image]][issues-url]
[![Build Status][build-image]][build-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Dependencies Status][dependencies-image]][dependencies-url]
[![Dev Dependencies Status][dev-dependencies-image]][dev-dependencies-url]
[![Commitizen Friendly][commitizen-image]][commitizen-url]

A complete Node.js project template using TypeScript and following general best practices.  It allows you to skip the tedious details for the following:

* Adding and configuring TypeScript support.
* Enabling TypeScript linting.
* Setting up unit tests and code coverage reports.
* Creating an NPM package for your project.
* Managing ignored files for Git and NPM.

Once you've enabled CI, test coverage, and dependency reports for your project, this README.md file shows how to add the badges shown above.  This project template even enables automated changelog generation as long as you follow [Conventional Commits](https://conventionalcommits.org), which is made simple through the included [Commitizen CLI](http://commitizen.github.io/cz-cli/).

## Contents

* [Project Creation](#project-creation)
* [Rebranding](#rebranding)
* [Contributing](#contributing)

## Project Creation

Clone this repo into the directory you want to use for your new project, delete the Git history, and then reinit as a fresh Git repo:

```bash
$ git clone https://github.com/nikolanikushev/node-typescript-template.git <your project directory>
$ cd <your project directory>
$ rm -rf ./.git/
$ git init
$ npm install
```

## Rebranding

It's a common practice to prefix the source code project name with `node-` to make it clear on GitHub that it's a Node.js project while omitting that prefix in the NPM project since it's understood on npmjs.com.  Thus, the order of these replacements matter.

Be sure to check both [GitHub](https://github.com) and [NPMJS](https://www.npmjs.com) to be sure your project name isn't taken before starting!

Use exact searches to perform the following replacements throughout this project for the most efficient rebranding process:

1. Replace my name with yours: `Chris Wells`
2. Replace my website URL with yours: `https://chriswells.io`
3. Replace my *GitHub* username and project name with yours: `nikolanikushev/node-typescript-template`
4. Replace my *NPM* project name with yours: `typescript-template`
5. Update [package.json](package.json):
	* Change `description` to suit your project.
	* Update the `keywords` list.
	* In the `author` section, add `email` if you want to include yours.
6. If you prefer something other than the [BSD 3-Clause License](https://opensource.org/licenses/BSD-3-Clause), replace the entire contents of [LICENSE](LICENSE) as appropriate.
7. Update this README.md file to describe your project.

## Contributing

This section is here as a reminder for you to explain to your users how to contribute to the projects you create from this template.

[project-url]: https://github.com/nikolanikushev/git-scraper
[package-image]: https://badge.fury.io/js/git-scraper.svg
[package-url]: https://badge.fury.io/js/git-scraper
[issues-image]: https://img.shields.io/github/issues/nikolanikushev/git-scraper.svg?style=popout
[issues-url]: https://github.com/nikolanikushev/git-scraper/issues
[build-image]: https://travis-ci.org/nikolanikushev/git-scraper.svg?branch=main
[build-url]: https://travis-ci.org/nikolanikushev/git-scraper
[coverage-image]: https://coveralls.io/repos/github/nikolanikushev/git-scraper/badge.svg?branch=main
[coverage-url]: https://coveralls.io/github/nikolanikushev/git-scraper?branch=main
[dependencies-image]: https://david-dm.org/nikolanikushev/git-scraper/status.svg
[dependencies-url]: https://david-dm.org/nikolanikushev/git-scraper
[dev-dependencies-image]: https://david-dm.org/nikolanikushev/git-scraper/dev-status.svg
[dev-dependencies-url]: https://david-dm.org/nikolanikushev/git-scraper?type=dev
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli
