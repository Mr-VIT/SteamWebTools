## Install
- [For Tampermonkey](https://github.com/Mr-VIT/SteamWebTools/releases/latest/download/steamwebtools.tm.user.js)

## Current support is being provided for:
[![Tampermonkey 4.0+](https://img.shields.io/badge/Tampermonkey-4.0%2B-green.svg)](https://tampermonkey.net/)
Greasemonkey support is deprecated


## Build
- Install [NodeJS](https://nodejs.org/)
- [Clone the SWT git repo](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository)
- Install dev dependencies (grunt plugins):
```
cd SteamWebTools && npm install
```
- Now by running the `npm run build` command, in the `SteamWebTools` directory, you can build a full version (`release/steamwebtools.tm.user.js`).
- Use `npm run build:github` if you want to publish a release to your GitHub repo


## Localization
Translate text `src/lang/en.js` and send me file or create Pull request

## License
licensed under GPLv2.