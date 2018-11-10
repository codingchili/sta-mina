#!/usr/bin/env node
'use strict';

let vm = require('vm');
let fs = require('fs');
let path = require('path');
let ArgumentParser = require('argparse').ArgumentParser;

let parser = new ArgumentParser({
	version: '0.1.0',
	addHelp: true,
	description: 'Sta-mina static site generator and dynamic web bundler manual.'
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
console.log(args);
console.log('');

let site = path.basename(args.data, path.extname(args.data));

function init() {
	let dir = `build/${site}`;
	if (!fs.existsSync('build')) {
		fs.mkdirSync('build');
	}

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(`build/${site}`);
	}	
}

init();

function copyToBuild(file) {
	let target = `build/${site}/${path.basename(file)}`;

	console.log('copy ' + target);

	fs.copyFileSync(path.join(process.cwd(), file), target);
}

function writeToBuild(name, content) {
	console.log('write ' + name);
	fs.writeFileSync(path.join(process.cwd(), `build/${site}/${name}`), content);
}

function readFile(path) {
	return fs.readFileSync(path, {encoding: 'utf8'});
}

let renderedTemplates = {};
let currentTemplate = null;
let currentData = null;

function render(template, data) {
	let file = path.basename(data, path.extname(data)) + '.html';

	if (!renderedTemplates[file]) {
		renderedTemplates[file] = true;
		console.log(`render ${template} using ${data}`);
		currentTemplate = template;
		currentData = data;

		template = readFile(path.join(process.cwd(), template));
		data = readFile(path.join(process.cwd(), data));
	
		let {theme, text, contact, external, seo} = JSON.parse(data);

		renderedTemplates[file] = eval('`' + template + '`');
		
	}
	return renderedTemplates[file];
}

function loader(template, data) {
	console.log(`generating loader for ${template} with ${data}`);
	let loader = readFile(path.join(__dirname, '../loader/index.html'));

	render(template, data);

	template = path.basename(template);
	data = path.basename(data);

	return eval('`' + loader + '`');
}

function link(template, data, content) {
	let file = path.basename(data, path.extname(data)) + '.html';
	let link;

	if (args.dynamic) {
		if (!renderedTemplates[file]) {
			copyToBuild(template);
			copyToBuild(data);
			render(template, data);
			writeToBuild(file, loader(template, data));
		}

		template = path.basename(template);
		data = path.basename(data);

		link =  `<a href="javascript:void(0);" onmouseover="link_preload('${template}', '${data}')" 
											  onmousedown="on_link('${template}', '${data}')">
					${content}
				</a>`;	
	} else {
		if (!renderedTemplates[file]) {
			writeToBuild(file, render(template, data));
		}

		link = `<a href="javascript:void(0);" onmousedown="location.href='${file}';">${content}</a>`;
	}
	return link;
}

if (args.dynamic) {
	let template = args.template;
	let data = args.data;

	writeToBuild('stamina-loader.js', readFile(path.join(__dirname, '../loader/stamina-loader.js')));
	writeToBuild('index.html', loader(template, data));
	copyToBuild(template);
	copyToBuild(data);
} else {	
	writeToBuild('index.html', render(args.template, args.data));
}

function copyDir(src,dest) {
	if (fs.existsSync(src)) {
		const entries = fs.readdirSync(src, {withFileTypes:true});

		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest);
		}
		for (let entry of entries) {
			const srcPath = path.join(src,entry.name);
			const destPath = path.join(dest,entry.name);


			if (entry.isDirectory()) {
				copyDir(srcPath, destPath);
			} else {
				if (!fs.existsSync(destPath)) {
					fs.copyFileSync(srcPath, destPath);
				}
			}
		}
	} else {
		console.log(`no ${src} directory found, not copied.`);
	}
}

console.log(`copying './web' directory..`);
copyDir('./web', `build/${site}/`);

console.log(`\x1b[32m\ngenerated site '${site}.'`);
