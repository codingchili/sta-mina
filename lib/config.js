const logger = require('./logger.js');
const fs = require('fs');
const path = require('path');

const PROJECT_FILE = 'stamina.json';

module.exports = {

    isProject: (file) => {
        file = file || PROJECT_FILE;
        return fs.existsSync(file);
    },

    project: (file) => {
        file = file || PROJECT_FILE;
        let data = fs.readFileSync(file, {encoding: 'utf8'});
        return JSON.parse(data);
    },

    generate: () => {
        fs.writeFileSync(path.join(process.cwd(), PROJECT_FILE), DEFAULT_CONFIG);
        logger.onFileWrite(PROJECT_FILE);
    },

    site: (template, data, dynamic, name, web) => {
        return {
            template: template,
            data: data,
            dynamic: dynamic,
            name: name,
            web: web
        }
    }
};

const DEFAULT_CONFIG = JSON.stringify({
    sites: [
        module.exports.site('path/to/your/template.html', 'path/to/your/data.json', false, 'sample-site', './web')
    ]
}, null, 2);