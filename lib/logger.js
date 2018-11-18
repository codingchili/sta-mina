

function green(text) {
    return `\x1b[32m${text}\x1b[1;0m`;
}

function red(text) {
    return `\x1b[31m${text}\x1b[1;0m`;
}

function gray(text) {
    return `\x1b[1;30m${text}\x1b[1;0m`;
}

function magenta(text) {
    return `\x1b[1;35m${text}\x1b[1;0m`;
}

function cyan(text) {
    return `\x1b[36m${text}\x1b[1;0m`;
}

function success(text) {
    return `\t${green('√')} ${gray(text)}`;
}

function fail(text) {
    return `\t${red('×')} ${gray(text)}`;
}

function log(text) {
    console.log(text);
}

module.exports = {

    arguments: (args) => {
        log(`${magenta(JSON.stringify(args, null, 2))}\n`);
    },

    started: (site) => {
        log(`${gray(`      Generating site.. `)} ${cyan(`${site}`)}`);
    },

    onDirCopied: (dir) => {
        log(success(`copied ${dir}`));
    },

    onDirNotCopied: (dir) => {
        log(fail(`skip copying '${dir}' directory not found.`));
    },

    onFileCopy: (source, target) => {
        log(success(`file ${source} copied to ${target}`));
    },

    onFileWrite: (file) => {
        log(success(`file ${file} written`));
    },

    onDirectoryCreated: (dir) => {
        log(success(`directory ${dir} created`));
    },

    onLoaderGenerated: (template, data) => {
        log(success(`generated loader for ${template} with ${data}`));
    },

    rendered: (template, data) => {
        log(success(`rendered ${template} using ${data}`));
    },

    done: (site, time) => {
        log(`${success(`done in ${time}ms`)}\n`);
    }
};