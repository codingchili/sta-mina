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

let site = path.basename(args.data, path.extname(args.data));

function init() {
	let dir = `build/${site}`;
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(`build/${site}`);
	}	
}

init();

function copyToBuild(source) {
	let target = `build/${site}/${path.extname(args.data)}`;
	fs.copyFileSync(path.resolve(__dirname, surce), target);
}

function writeToBuild(name, content) {
	fs.writeFileSync(`build/${site}/${name}`, content);
}

let currentTemplate = null;
let currentData = null;

function render(template, data) {
	currentTemplate = template;
	currentData = data;

	template = fs.readFileSync(path.join(__dirname, template), {encoding: 'utf8'});
	data = fs.readFileSync(path.join(__dirname, data), {encoding: 'utf8'});
	
    let {theme, text, contact, external, seo} = JSON.parse(data);
	let render = eval('`' + template + '`');
	return render;
}

function link(template, data, content) {
	if (template == currentTemplate && data == currentData) {
		return `<a href="javascript:void(0)" onmousedown="location.reload()">${content}</a>`;
	}

	if (args.dynamic) {
		copyToBuild(template);
		copyToBuild(data);

		template = path.extname(template);
		data = path.extname(data);

		return `<a href="javascript:void(0);" onmouseover="link_preload('${template}', '${data}')" 
											  onmousedown="on_link('${template}', '${data}')">
					${content}
				</a>`;	
	} else {
		let file = path.basename(template, path.extname(template)) + '.' +
							 path.basename(data, path.extname(data)) + '.html';

		writeToBuild(file, render(template, data));
		return `<a href="javascript:void(0);" onmousedown="location.href='${file}';">${content}</a>`;
	}
	// if static; run render and output to /build/site return regular link
}

if (args.dynamic) {
	// copy /web into build/sitename/*
	// run eval to find linked sites???
	copyToBuild();
} else {	
	writeToBuild('index.html', render(args.template, args.data));
}

console.log(`generated site '${site}.'`);
// zip up build/*/ into separate zips into build/dist/
