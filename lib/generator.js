const logger = require('./logger.js');
const build = require('./build.js');
const renderer = require('./renderer.js');
const path = require('path');


function copyWebResources(web) {
    if (web) {
        build.copyDir(web, build.target());
    }
}

function done() {
    logger.done(build.site(), build.time());
}

module.exports = {

    dynamics: (site) => {
        build.init(site.template, site.data, true, site.name);
        logger.started(build.site());
        build.writeToBuild('stamina-loader.js', build.readFile(path.join(__dirname, '../loader/stamina-loader.js')));
        build.writeToBuild('index.html', renderer.loader(site.template, site.data));
        build.copyToBuild(site.template);
        build.copyToBuild(site.data);
        copyWebResources(site.web);
        done();
    },

    statics: (site) => {
        build.init(site.template, site.data, false, site.name);
        logger.started(build.site());
        build.writeToBuild('index.html', renderer.render(site.template, site.data));
        copyWebResources(site.web);
        done();
    }
};
