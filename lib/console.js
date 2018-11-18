const ArgumentParser = require('argparse').ArgumentParser;
const generator = require('./generator.js');
const logger = require('./logger.js');
const config = require('./config.js');

let parser = new ArgumentParser({
    version: '0.1.4',
    addHelp: true,
    description: 'Sta-mina static site generator.'
});

parser.addArgument(['-f', '--file'], {
    help: 'local file with project settings.',
    action: 'store'
});

parser.addArgument(['-d', '--dynamic'], {
    help: 'generate a dynamic site, default is false.',
    action: 'storeTrue'
});

parser.addArgument(['--template'], {
    help: 'local file or URL to a .html template.',
    action: 'store'
});

parser.addArgument(['--data'], {
    help: 'local file or URL to a .json file.',
    action: 'store'
});

parser.addArgument(['--configure'], {
    help: 'generates project configuration.',
    action: 'storeTrue'
});

let args = parser.parseArgs();

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

            for (let site of project.sites) {
                generate(site);
            }
        } else {
            parser.printHelp();
        }
    } else {
        logger.arguments(args);
        generate(config.site(args.template, args.data, args.dynamic, null, './web'));
    }
}