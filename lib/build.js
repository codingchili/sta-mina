const logger = require('./logger');
const path = require('path');
const fs = require('fs');

let site = null;
let out = null;
let dynamic = null;
let time;

let template = null;
let data = null;

module.exports = {

    init: (_template, _data, _dynamic, _site) => {
        dynamic = _dynamic;
        template = _template;
        data = _data;

        time = process.uptime() * 1000;

        if (!_site) {
            site = path.basename(data, path.extname(data));
        } else {
            site = _site;
        }

        out = `build/${site}`;

        if (!fs.existsSync('build')) {
            fs.mkdirSync('build');
        }

        if (!fs.existsSync(out)) {
            fs.mkdirSync(out);
        }
    },

    time: () => {
      return ((process.uptime() * 1000) - time);
    },

    copyDir: (src, dest, options) => {
        if (fs.existsSync(src)) {
            const entries = fs.readdirSync(src, {withFileTypes: true});

            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest);
                logger.onDirectoryCreated(dest);
            }

            for (let entry of entries) {
                const srcPath = path.join(src, entry.name);
                const destPath = path.join(dest, entry.name);

                if (entry.isDirectory()) {
                    copyDir(srcPath, destPath);
                } else {
                    options = options || {};

                    if (options.skipExtension) {
                        if (path.extname(srcPath) !== options.skipExtension) {
                            fs.copyFileSync(srcPath, destPath);
                        }
                    } else {
                        fs.copyFileSync(srcPath, destPath);
                    }
                }
            }
            logger.onDirCopied(src);
        } else {
            logger.onDirNotCopied(src);
        }
    },

    copyToBuild: (file) => {
        let target = `${out}/${path.basename(file)}`;

        if (fs.lstatSync(file).isDirectory()) {
            copyDir(file, target);
        } else {
            let source = path.join(process.cwd(), file);
            fs.copyFileSync(source, target);
            logger.onFileCopy(path.basename(source), target);
        }
    },

    writeToBuild: (name, content) => {
        let target = `${out}/${name}`;
        fs.writeFileSync(path.join(process.cwd(), target), content);
        logger.onFileWrite(target);
    },

    readFile: (path) => {
        return fs.readFileSync(path, {encoding: 'utf8'});
    },

    target: () => {
        return out;
    },

    site: () => {
        return site;
    },

    dynamic: () => {
        return dynamic;
    },

    template: () => {
        return template;
    },

    data: () => {
        return data;
    }
};