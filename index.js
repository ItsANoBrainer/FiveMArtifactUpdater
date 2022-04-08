const Config = require('./config.json');
const doPrompt = require('prompt-sync')({ sigint: true });
const fs = require('fs');
const axios = require("axios").default;
const StreamZip = require('node-stream-zip');

main()

async function main() {
    GrabArguments()

    log(`[Update] Starting Artifacts updater by ItsANoBrainer.`)
    prompt(`[Update] Press enter to begin. This will delete everything inside: ${Config.artifactsDirectory} `)

    await DeleteLocation(Config.zipDirectory)
    const { downloadURL, buildVersion } = await GetDownloadData(Config.artifactsURL, Config.downloadType)
    const zipFileName = await DownloadFile(downloadURL, Config.zipDirectory)
    await DeleteLocation(Config.artifactsDirectory)
    await ExtractZippedFiles(`${Config.zipDirectory}${zipFileName}`, Config.artifactsDirectory)
    await DeleteLocation(Config.zipDirectory)

    log(`[Update] Done updating Artifacts for build ${buildVersion}.`)
    prompt(`[Update] Press enter to finish...`)
}

function GrabArguments() {
    const myArgs = process.argv.slice(2);
    const boolArgs = ['verbose', 'allowPrompt']

    Object.keys(Config).forEach((key) => {
        if (myArgs.includes(`-${key}`)) {
            let newConfig = myArgs[myArgs.indexOf(`-${key}`) + 1]
            if (boolArgs.includes(key)) newConfig = (newConfig == 'true')
            Config[key] = newConfig
        }
    })
}

function log(msg, verbose) { if (!verbose || (verbose && Config.verbose)) console.log(msg) }
function prompt(msg) { if (Config.allowPrompt) doPrompt(msg) }

function DeleteLocation(dir) {
    log(`[Delete] Deleting ${dir}`)
    return new Promise(resolve => {
        if (fs.existsSync(dir)) {
            fs.rm(dir, { recursive: true }, (err) => {
                if (err && err.errno != -4058) { log(`[Delete] Failed to delete ${dir}.`); process.exit(); }
                log(`[Delete] ${dir} is deleted!`, true);
                resolve()
            });
        } else {
            log(`[Delete] ${dir} did not exist to delete.`, true);
            resolve()
        }
    });
}

function GetDownloadData(url, type) {
    log(`[Request] Requesting download information for artifacts for build type '${type}' from ${url}.`)
    return new Promise(async resolve => {
        const options = { method: 'GET', url: url };

        axios.request(options).then(function (response) {
            const data = response.data
            const downloadURL = data[`${type}_download`]
            const buildVersion = data[type]

            if(!downloadURL || !buildVersion) { log(`[Request] Download information for build type '${type}' not found.`); process.exit() }
            log(`[Request] Download information found | Url: ${downloadURL} | Build: ${buildVersion}`, true)
            resolve({ downloadURL, buildVersion })
        }).catch(function (error) {
            log('[Request] Failed to retrive download information.')
            console.error(error);
            process.exit()
        });
    });
}

function DownloadFile(url, dest) {
    log(`[Download] Downloading ${url} to ${dest}`)
    return new Promise(resolve => {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        const options = { method: 'GET', url: url, responseType: 'stream', };
        const fileName = url.split('/').at(-1);
        const writer = fs.createWriteStream(`${dest}/${fileName}`);
        axios.request(options).then(function (response) {
            log(`[Download] Got file, starting download of ${fileName}`, true)
            response.data.pipe(writer)
            writer.on('finish', () => { log(`[Download] Download finished for ${fileName}`, true); resolve(fileName) })
        }).catch(function (error) {
            log('[Download] Failed to download file.')
            console.error(error);
            process.exit()
        });
    });
}

function ExtractZippedFiles(file, dest) {
    log(`[Extract] Extracting ${file} to ${dest}`)
    return new Promise(async resolve => {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        const zip = new StreamZip.async({ file: file });
        zip.on('error', err => {
            log(`[Extract] Failed to extract ${file} to ${dest}`)
            console.error(err);
            process.exit()
        });
        const count = await zip.extract(null, dest);
        await zip.close();
        log(`[Extract] Extracting finished moving ${count} files`, true)
        resolve()
    });
}