const generator = require('../lib/generator.js');
const config = require('../lib//config.js');

const TEMPLATE = './test/resources/start.html';
const DATA = './test/resources/start.json';

describe('sta-mina', () => {
    describe('render static', () => {
        it('render demo page', () => {
            generator.statics(config.site(
                TEMPLATE,
                DATA
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