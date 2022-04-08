# ItsANoBrainer

If you like or use this application, please consider supporting by starring the repo and checking out my other resources.

## _FiveM Artifact Updater_

[![N|Solid](https://i.imgur.com/sfDPQf9.png)](https://nodejs.org/)

FiveM Artifact Updater is an application created with Node.JS to easily and quickly install/update your artifacts with the click of a button. No more are the days of needing to manually navigate to the Artifacts Site, download whatever version, unzip and replace your files. This tool does all that for you, and more with config file to tune it to your liking, as well as support for replacing all config file items with command line arguments for on the fly usage. It will also clean up after itself afterwards!

## Features
- Ability to install the latest, recommended, newest, or critical FiveM builds with a single click
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
- downloadType `<type>` | Which dynamic build to pull. Supports `latest` for the newest build, `optional` for the optional build, and `recommended` for the recommended build, and `critical` for whatever thats for
- verbose `<true/false>` | Show more console logging 
- allowPrompt `<true/false>` | Prompt the user for input before starting and doing important things

### Default `config.json`
```
{
    "artifactsURL": "https://runtime.fivem.net/artifacts/fivem/build_server_windows/master",
    "artifactsDirectory": "../artifacts/",
    "zipDirectory": "./artifacts-zipped/",
    "downloadType": "latest",
    "verbose": false,
    "allowPrompt": true
}
```

## Tech
- [Node.JS](https://nodejs.org/en/) - evented I/O for the backend

### How it Works
This was a great personal project not only for my use case (needing to easily and quickly update my servers artifacts), but also to spend more time learning Javascript and some new Node.JS modules. Here is what it does:

1. Reuqest - Use a get request with the cfx changelog api endpoint to get the url for the artifact build we want
2. Download New Artifacts - Using `axios` we download the `server.zip` from the request url
3. Delete Current Artifacts - If they exist, we use `fs` to delete the current artifacts
4. Extract `server.zip - Using `node-stream-zip` we extract the `server.zip` files into our artifacts folder 
5. Cleanup - Using `fs` we delete everything we downloaded

## Development
Want to contribute? Great! 

This is an application for competant people who can follow directions. If you know what you're doing and are encountering issues, use the Issues and Pull Request section appropriately.

## Change Log
### v2.0.0
* Refactored codebase, use new system for getting artifacts url, downloading, and extracting
* Removed webscrape dependency
* Removed html parser dependency
* Removed https dependency
* Removed 7zip-bin and node-7z dependencies (bulk of disk size change)
* Moved download from https to axios
* Removed buildSpecific option as the new method does not support it. Use v1.0.0 if you really need it.
* 50% less lines, 28% less characters


### v1.0.0
* Initial Release 

## Future ToDos
* Linux support?

## License
[GNU GPL v3](http://www.gnu.org/licenses/gpl-3.0.html)
