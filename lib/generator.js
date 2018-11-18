const logger = require('./logger.js');
const build = require('./build.js');
const renderer = require('./renderer.js');
const path = require('path');


function copyWebResources() {
    build.copyDir('./web', build.target());
}

function done() {
    logger.done(build.site(), build.time());
}

module.exports = {

    dynamics: (template, data) => {
        build.init(template, data, true);
        logger.started(build.site());
        build.writeToBuild('stamina-loader.js', build.readFile(path.join(__dirname, '../loader/stamina-loader.js')));
        build.writeToBuild('index.html', renderer.loader(template, data));
        build.copyToBuild(template);
        build.copyToBuild(data);
        copyWebResources();
        done();
    },

    statics: (template, data) => {
        build.init(template, data, false);
        logger.started(build.site());
        build.writeToBuild('index.html', renderer.render(template, data));
        copyWebResources();
        done();
    }
};
