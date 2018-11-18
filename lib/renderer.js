const logger = require('./logger.js');
const build = require('./build.js');
const path = require('path');

let renderedTemplates = {};

function getRender(template, data) {
    return renderedTemplates[`${template}.${data}`];
}

function setRendered(template, data, output) {
    renderedTemplates[`${template}.${data}`] = output;
}

module.exports = {

    render: (template, data) => {
        let file = path.basename(data, path.extname(data)) + '.html';

        if (!getRender(template, data)) {
            setRendered(template, data, 'tmp');

            let html = build.readFile(path.join(process.cwd(), template));
            let variables = build.readFile(path.join(process.cwd(), data));

            let {theme, text, contact, external, seo} = JSON.parse(variables);

            setRendered(template, data, eval('`' + html + '`'));
            logger.rendered(template, data);
        }
        return getRender(template, data);
    },

    loader: (template, data) => {
        let loader = build.readFile(path.join(__dirname, '../loader/index.html'));

        module.exports.render(template, data);

        template = path.basename(template);
        data = path.basename(data);

        loader = eval('`' + loader + '`');

        logger.onLoaderGenerated(template, data);
        return loader;
    },

    link: (template, data, content) => {
        let file = path.basename(data, path.extname(data)) + '.html';
        let link;

        if (build.dynamic()) {
            if (!getRender(template, data)) {
                //build.copyToBuild(template);
                //build.copyToBuild(data);
                //module.exports.render(template, data);

                // todo: deep linking.
                // build.writeToBuild(file, module.exports.loader(template, data));
            }

            template = path.basename(template);
            data = path.basename(data);

            link = `<a href="javascript:void(0);" onmouseover="link_preload('${template}', '${data}')" 
											  onmousedown="on_link(event, '${template}', '${data}')">
					${content}
				</a>`;
        } else {
            if (!getRender(template, data)) {
                setRendered(template, data,  module.exports.render(template, data));
                build.writeToBuild(file, getRender(template, data));
            }

            link = `<a href="javascript:void(0);" onmousedown="event.which === 1 ? location.href='${file}' : null;">${content}</a>`;
        }
        return link;
    }
};

let link = module.exports.link;