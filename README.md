## Metro Start
[![Build Status](https://travis-ci.org/chustar/metro-start.svg?branch=master)](https://travis-ci.org/chustar/metro-start)
<!--[![Build Status](https://circleci.com/gh/chustar/metro-start/tree/master.png?circle-token=:circle-token)](https://circleci.com/gh/chustar/metro-start)-->

A new tab page for Google Chrome inspired by Zune.

[Available on the Google Chrome Store](https://chrome.google.com/webstore/detail/bbhdfpmfdplolnnkpdepnelcfdmikjfd)

⚡ Powered by:
* [Trianglify](http://qrohlf.com/trianglify/)
* [Jquery](https://jquery.com/)
* [JSS](https://github.com/Box9/jss)
* [MetroSelect](https://github.com/metro-start/metro-select)
* [Pickr](https://github.com/simonwep/pickr)
* [TinyColor](https://github.com/bgrins/TinyColor)
* [and others...](https://github.com/metro-start/metro-start/blob/master/package.json)

### Development

This project uses [Bun 1.4.0](https://bun.sh/) as its package manager and runtime.

```sh
bun install --frozen-lockfile
bun run lint
bun run build:all
```

Use `bun run build:chrome`, `bun run build:firefox`, or `bun run build:xcode`
to build a single browser target.
