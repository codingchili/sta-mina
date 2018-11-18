const ArgumentParser = require('argparse').ArgumentParser;
const generator = require('./generator.js');
const logger = require('./logger.js');

let parser = new ArgumentParser({
    version: '0.1.4',
    addHelp: true,
    description: 'Sta-mina static site generator.'
});

parser.addArgument(
    [ '-d', '--dynamic' ],
    {
        help: 'generate a dynamic site, default is false.',
        action: 'storeTrue'
    }
);

parser.addArgument(
    [ '--template' ],
    {
        help: 'local file or URL to a .html template.',
        action: 'store'
    }
);

parser.addArgument(
    ['--data'],
    {
        help: 'local file or URL to a .json file.',
        action: 'store'
    }
);

let args = parser.parseArgs();
logger.arguments(args);

if (args.dynamic) {
    generator.dynamics(args.template, args.data);
} else {
    generator.statics(args.template, args.data);
}
