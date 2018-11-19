# sta-mina
[![npm version](https://badge.fury.io/js/static-mina.svg)](https://badge.fury.io/js/static-mina)
[![Build Status](https://travis-ci.org/codingchili/sta-mina.svg?branch=master)](https://travis-ci.org/codingchili/sta-mina)

Minimal static/dynamic site generator. status: in development. 

![preview](https://raw.githubusercontent.com/codingchili/sta-mina/master/preview.png "Current snapshot version")

Sample snapshot of a render of the git-project template.


## Background
Stamina uses templates that are parsed as template literals. It is a minimal static
site generator and web framework in one. With two modes of site generation.


## Installing
Installing the generator is super easy.

```
λ npm install -g static-mina
```

'stamina' should now be available on your CLI, check it with
```
λ stamina -h
usage: console.js [-h] [-v] [-f FILE] [-d] [--template TEMPLATE] [--data DATA]
                  [--configure]

Sta-mina static site generator.

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -f FILE, --file FILE  local file with project settings.
  -d, --dynamic         generate a dynamic site, default is false.
  --template TEMPLATE   local file or URL to a .html template.
  --data DATA           local file or URL to a .json file.
  --configure           generates project configuration.
``` 

Ready to rock!

## Tutorial

Example of a minimal template

```
<html>
<style>
	span {
		color: ${theme.font}
	}
</style>
<body bgcolor="${theme.bg}">
	<span>${text.title}</span>
</body>
</html>
```

A sample data file used to render the template,
```
{
	"theme": {
		"font": "red",
		"bg": "#000"
	},
	"text": {
		"title": "hello world."
	}
}
```

Now, create two files `template.html` to hold the template data and `site.json` to hold the data.



When installed we can generate a static site using the following snippet,
```
λ stamina --template template.html --data site.json
```

Alternatively, we can create a dynamically loaded site using this,
```
λ stamina --dynamic --template template.html --data site.json
```

Dynamic sites are rendered at runtime, which means that we can point to two templates at 
arbitrary locations - maybe you want your site.json to be available in your git repo for example.

After running the above commands the generated site will be present under build/site/*.

#### Multi-project setup
To create a new project configuration file run the following,

```
λ stamina --configure
```

This creates the file `stamina.json` in your current directory.

```
{
  "sites": [
    {
      "template": "path/to/your/template.html",
      "data": "path/to/your/data.json",
      "dynamic": false,
      "name": "sample-site",
      "web": "./web"
    }
  ]
}
```

Sites is a list of sites you want to build, a template and data file needs to be specified.
Name is optional and defaults to the filename of the data file. Dynamic indicates if we are to
generate a dynamic or static site. Web is an optional directory with static resources to copy to the
output directory, place your css/js/images there.

#### Building a multi-project setup
Build all projects in `stamina.json`
```
λ stamina
```

Build all projects in configuration file settings.json,
```
λ stamina -f projects/settings.json
```

Build with specified project file and site name,
```
λ stamina -f projects/settings.json --name mywebsite-1
```

## Linking in multi-site projects
The only real feature apart from site generation is linking. Links are resolved at compile
time and are used to create multi-site projects.

A link can be created using the framework by invoking the following method, `link(template, data, content)`.

template - a local template file or in the future also a remote file.
data 	 - a local data file or in the future also a remote file
content  - this is the content of the link that is created.

Example
```
<div class="some-css">
	${link('templates/git-project.html', 'sites/my-project.json', 
		`<div>click me</div>`
	)}
<div>
```

Produces the following link in static mode:

```
<a href="javscript:void(0)" onmousedown="event.which == 1 ? location.href='template' : ''">
	content
</a>
```
Note that 'template' here will reference a new filename, which is the template rendered with the referenced json file.

A link looks like this in dynamic mode:

```
<a href="javscript:void(0)" onmousedown="link_load(template, site)" onmouseover="link_preload(template, site)">
	content
</a>
```
When the link is hovered the loader issues two network requests to fetch the template and jso file.
When a link is clicked in dynamic mode, the template is rendered and a new document is written
without navigating to a new site.

For sites that don't require multiple templates, we recommend using regular links.

### History

History works fine for static pages, when using the link feature in dynamic mode no support is
implemted yet. Altough it is planned and is easily implemented in the loader :)


## Contributing

This project is in an experimental stage, we don't accept any bug reports or contributions yet.

