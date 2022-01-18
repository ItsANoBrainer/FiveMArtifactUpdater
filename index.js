const Config = require('./config.json');
const prompt = require('prompt-sync')({sigint: true});
const fs = require('fs');
const scrape = require('website-scraper');
const HTMLParser = require('node-html-parser');
const https = require('https');
const sevenBin = require('7zip-bin');
const { extractFull } = require('node-7z');


main()
async function main() {
    grabArguments()

    console.log(`[Update] Starting Artifacts updater by ItsANoBrainer.`)
    if (Config.allowPrompt) prompt(`[Update] Press enter to begin. This will delete everything inside: ${Config.artifactsDirectory} `)

    await cleanUpFolders()
    await scrapeWebpage(Config.artifactsURL, Config.webscrapeDirectory)
    const scrapedURL = await parseHTML(Config.webscrapeDirectory)
    await downloadFile(`${Config.artifactsURL}/${scrapedURL}`, Config.zipDirectory, Config.zipFileName)
    await deleteLocation(Config.artifactsDirectory)
    await extractZip(`${Config.zipDirectory}${Config.zipFileName}`, Config.artifactsDirectory)
    await cleanUpFolders()

    console.log(`[Update] Done updating Artifacts for build ${scrapedURL.split('-')[0]}.`)
    if (Config.allowPrompt) prompt(`[Update] Press enter to finish...`)
}

function grabArguments() {
    const myArgs = process.argv.slice(2);

    const intArgs = ['buildSpecific']
    const boolArgs = ['verbose', 'allowPrompt']

    Object.keys(Config).forEach((key) => {
        if (myArgs.includes(`-${key}`)) {
            let newConfig = myArgs[myArgs.indexOf(`-${key}`)+1] 

            if(intArgs.includes(key)) newConfig = parseInt(newConfig)
            if(boolArgs.includes(key)) newConfig = (newConfig == 'true')

            Config[key] = newConfig
        }
    })
}

function cleanUpFolders() {
    return new Promise(async resolve => {
        console.log(`[Cleanup] Tidying up webscrape and zip directories.`)
        await deleteLocation(Config.webscrapeDirectory)
        await deleteLocation(Config.zipDirectory)
        resolve()
    });
}

function deleteLocation(dir) {
    console.log(`[Delete] Deleting ${dir}`)
    return new Promise(resolve => {
        if (fs.existsSync(dir)){
            fs.rm(dir, { recursive: true }, (err) => {
                if (err && err.errno != -4058) {
                    console.log(`[Delete] Failed to delete ${dir}.`);
                    process.exit()
                } else {
                    if(Config.verbose) console.log(`[Delete] ${dir} is deleted!`);
                    resolve()
                }
            });
        } else {
            if(Config.verbose) console.log(`[Delete] ${dir} did not exist to delete.`);
            resolve()
        }

    });
}

function scrapeWebpage(webURL, saveDirectory) {
    console.log(`[Scrape] Scraping ${webURL}`)
    return new Promise(async resolve => {
        const result = await scrape({
            urls: [webURL],
            directory: saveDirectory
        });
    
        if (result) {
            if(Config.verbose) console.log(`[Scrape] Scraping done!`)
            resolve()
        } else {
            console.log(`[Scrape] Scraping failed!`)
            process.exit()
        }
    });
}

async function parseHTML(dir) {
    console.log(`[Parse] Parsing ${dir}index.html`)
    return new Promise(async resolve => {
        const root = HTMLParser.parse(fs.readFileSync(`${dir}index.html`))

        let url;
        let buildNumber = Config.buildSpecific;
        switch (Config.downloadType) {
            case 'specific':
            case 'custom':
                while(!Number.isInteger(buildNumber)) {
                    buildNumber = parseInt(prompt('[Parse] What build number would you like? '))
                }
                url = (root.querySelector(`.panel a[href^="./${buildNumber}-"]`)?._attrs.href)?.substring(2)
                break;
            case 'newest':
            case 'latest':
                url = (root.querySelector('.is-active')._attrs.href).substring(2)
                break;
            case 'optional':
                url = (root.querySelector('.is-danger')._attrs.href).substring(2)
                break;
            case 'recommended':
            default:
                url = (root.querySelector('.is-primary')._attrs.href).substring(2)
                break;
        }

        if (url) {
            if(Config.verbose) console.log(`[Parse] Found our url for downloading ${Config.downloadType}: ${url}`)
            resolve(url)
        } else {
            console.log(`[Parse] Did not find a valid url for download type ${Config.downloadType}${url ? '.' : `, build number ${buildNumber}.`}`)
            process.exit()
        }
    });
}

function downloadFile(url, dest, name) {
    console.log(`[Download] Downloading ${url} to ${dest}`)
    return new Promise(resolve => {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        var file = fs.createWriteStream(`${dest}${name}`);
        https.get(url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                if(Config.verbose) console.log('[Download] Success downloading file.')
                file.close(resolve()); // close() is async, call cb after close completes.
            });
        }).on('error', function(err) { // Handle errors
            fs.unlink(`${dest}${name}`); // Delete the file async. (But we don't check the result)
            console.log('[Download] Failed to download file.')
            console.log(err)
            process.exit()
        });
    });
}

function extractZip(zip, dest) {
    console.log(`[Extract] Attempting to extract ${zip} to ${dest}`)

    return new Promise(resolve => {
        const myStream = extractFull(zip, dest, {
            $progress: true,
            $bin: sevenBin.path7za
        })

        myStream.on('end', function() {
            if(Config.verbose) console.log(`[Extract] Success extracting zip.`)
            resolve()
        })

        myStream.on('error', (err) => {
            console.log(`[Extracting] Failed extracting zip.`)
            console.log(err)
            process.exit()
        })
    });
}