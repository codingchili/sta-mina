const generator = require('../lib/generator.js');
const config = require('../lib//config.js');

const TEMPLATE = './test/resources/start.html';
const DATA = './test/resources/start.json';

const TEMPLATE_YAML = './test/resources/yaml-support.html';
const DATA_YAML = './test/resources/yaml-support.yaml';

describe('sta-mina', () => {
    describe('render static', () => {
        it('render demo page', () => {
            generator.statics(config.site(
                TEMPLATE,
                DATA
            ));
        });

        it('render demo page (yaml)', () => {
            generator.statics(config.site(
                TEMPLATE_YAML,
                DATA_YAML
            ));
        });
    });

    describe('render dynamic', () => {
        it('render demo page', () => {
            generator.dynamics(config.site(
                TEMPLATE,
                DATA
            ));
        });
    });

    describe('project configuration', () => {
        it('generate', () => {
            config.generate();
        });
    });
});