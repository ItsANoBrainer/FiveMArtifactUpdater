# ItsANoBrainer
## _FiveM Artifact Updater_

[![N|Solid](https://i.imgur.com/sfDPQf9.png)](https://nodejs.org/)

FiveM Artifact Updater is an application created with Node.JS to easily and quickly install/update your artifacts with the click of a button. No more are the days of needing to manually navigate to the Artifacts Site, download whatever version, unzip and replace your files. This tool does all that for you, and more with config file to tune it to your liking, as well as support for replacing all config file items with command line arguments for on the fly usage.

## Features
- Ability to install the latest, recommended, newest, or custom FiveM build with a single click
- Ability to use custom command line arguments to adjust install on a case by case basis

## Installation
FiveM Artifact Updater requires [Node.js](https://nodejs.org/) to run.

1. Install Node.JS. May require a computer restart.
2. Place the `FiveMArtifactUpdater` folder in the same directory as your `txData` and `artifacts` folders
3. Run `InstallDependencies.bat` or `npm install` in the install directory 

## Usage
After installing the dependencies you can use the application. 

1. Navigate to the `config.json` and verify the `artifactsDirectory` value matches the folder name of the artifacts folder your server is using. By default this is `artifacts`. This application's folder should be in the same directory as your `txData` and `artifacts` folders. 
2. Verify the `downloadType` in the `config.json` is what you want. Supported options are below
3. Run the `UpdateArtifacts.bat` and follow the prompts


## Command Line Arguments
You can edit the `UpdateArtifacts.bat` file and add as many command line arguments like below:
```
node index.js -allowPrompt false
```

This works for any and all keys in the `config.json`:
- artifactsURL `<url>` | URL to webscrape from
- artifactsDirectory `<directoryName>` | Directory to place the unzipped artifacts
- webscrapeDirectory `<directoryName>` | Directory to place the downloaded webscrape
- zipDirectory `<directoryName>` | Directory to place the zip
- zipFileName `<fileName>` | Name of the downloaded artifacts file
- downloadType `<type>` | Which dynamic build to pull. Supports `specific`/`custom` for `buildSpecific` section below, `newest`/`latest` for the newest build, `optional` for the optional build, and `recommended` for the recommended build
- buildSpecific `<5000>` | Use a specific build number. `downloadType` must be `custom` or `specific` to use this 
- verbose `<true/false>` | Show more console logging 
- allowPrompt `<true/false>` | Prompt the user for input before starting and doing important things

### Default `config.json`
```
{
    "artifactsURL": "https://runtime.fivem.net/artifacts/fivem/build_server_windows/master",
    "artifactsDirectory": "../artifacts/",
    "webscrapeDirectory": "./webscrape/",
    "zipDirectory": "./artifacts-zipped/",
    "zipFileName": "server.7z",
    "downloadType": "latest",
    "buildSpecific": null,
    "verbose": false,
    "allowPrompt": true
}
```

## Tech
- [Node.JS](https://nodejs.org/en/) - evented I/O for the backend

## Development
Want to contribute? Great! Use the Issues and Pull Request section appropriately.

## Change Log
### v1.0
* Initial Release 

## Future ToDos
* Download only the HTML file of the page, or see if its possible to grab all the data we want directly with [sources web-scrape option](https://www.npmjs.com/package/website-scraper#sources) and eliminate the downloading entirely.

## License
[GNU GPL v3](http://www.gnu.org/licenses/gpl-3.0.html)