const ArgumentParser = require('argparse').ArgumentParser;
const generator = require('./generator.js');
const logger = require('./logger.js');
const config = require('./config.js');
const build = require('./build.js');

let parser = new ArgumentParser({
    version: '0.1.4',
    addHelp: true,
    description: 'Sta-mina static site generator.'
});

parser.addArgument(['-f', '--file'], {
    help: 'local file with project settings.',
    action: 'store'
});

parser.addArgument(['-n', '--name'], {
    help: 'name of the configuration to generate.',
    action: 'store'
});

parser.addArgument(['-d', '--dynamic'], {
    help: 'generate a dynamic site, default is false.',
    action: 'storeTrue'
});

parser.addArgument(['--template'], {
    help: 'local .html template.',
    action: 'store'
});

parser.addArgument(['--data'], {
    help: 'local json/yaml file.',
    action: 'store'
});

parser.addArgument(['--configure'], {
    help: 'generates project configuration.',
    action: 'storeTrue'
});

let args = parser.parseArgs();
logger.newline();

function generate(site) {
    if (site.dynamic) {
        generator.dynamics(site);
    } else {
        generator.statics(site);
    }
}

if (args.configure) {
    config.generate();
} else {
    if (!args.template || !args.data) {
        if (args.file || config.isProject()) {
            let project = config.project(args.file);

            // generate all sites in configuration.
            for (let site of project.sites) {
                let name = site.name || build.projectName(site.data);

                if (args.name) {
                    // site name specified: skip others.
                    if (args.name === name) {
                        generate(site);
                    }
                } else {
                    // no name specified generate all sites in configuration.
                    generate(site);
                }
            }
        } else {
            // no data or template specified and no project file present or specified.
            parser.printHelp();
        }
    } else {
        logger.arguments(args);
        generate(config.site(args.template, args.data, args.dynamic, null, './web'));
    }
}