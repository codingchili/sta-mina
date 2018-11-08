#!/usr/bin/env node
'use strict';

let ArgumentParser = require('argparse').ArgumentParser;
let parser = new ArgumentParser({
	version: '0.1.0',
	addHelp: true,
	description: 'Sta-mina static site generator and dynamic web bundler manual.'
});

parser.addArgument(
	[ '-s', '--static' ],
	{
		help: 'static generation',
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
console.dir(args);
