/* 
 *  Loader.js for sta-mina.
 */
function download(callback, resource) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            callback(xhttp.responseText);
        }
    };
    xhttp.open("GET", resource, true);
    xhttp.send();
}

function onerror(e, source) {
    let line, target;

    if (source.template) {
        line = e.stack.split('\n');
        line = line[1].split(':');
        line = line[line.length -2];
        target = `${source.template.split('\n')[parseInt(line) -1]}`;
    }
    document.open();
    document.write(`
        <html>
        <body>
            <h1>${e.message}</h1>
            <textarea ${line ? '' : 'hidden'} cols="120" rows="1" style="border:none;resize:none;" disabled>
${line}: ${target}</textarea>
            <h4>
            <pre><code>${e.stack}</code></pre>
            </h4>
            <span style="position:absolute;bottom:32px;left:0;right:0;text-align:center;">
                sta-mina &copy 2018 Robin Duda
            </span>
        </body>
        </html>
    `);
    document.close();
}

// no-op because the loader is already loaded at this stage.
function stamina_loader() {
	return ``;
}

function link_preload(template, data) {
    this.data = null;
    this.template = null;
    this.load(template, data, (content) => {
        this.template = this.template || content.template;
        this.data = this.data || content.data;
    });
}

function link(template, data, content) {
    return `<a href="javascript:void(0);" onmouseover="link_preload('${template}', '${data}')" onmousedown="on_link('${template}', '${data}')">${content}</a>`; 
}

function on_link(template, data) {
    if (this.template && this.data) {
        this.loaded({template: this.template, data: this.data});
    } else {
        this.load(template, data);
    }
}

function loaded(content) {
    this.data = content.data || this.data;
    this.template = content.template || this.template;
    
    if (this.data != null && this.template != null) {
        let {theme, text, contact, external, seo} = this.data;

        document.open();
        try {
            let rendered = eval('`' + this.template + '`')
            document.write(rendered);
            window.scroll(0, 0);
        } catch (e) {
            onerror(e, {template: this.template});
        }
        document.close();
    }
}

function load(template, data, callback) {
    callback = callback || this.loaded;

    download(template => { 
        callback({template: template});
    }, template);

    download(data => {
        try {
            callback({data: JSON.parse(data)});
        } catch (e) {
            onerror(e, {data: data});
        }
    }, data);
}
