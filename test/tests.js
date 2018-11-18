const generator = require('../lib/generator.js');

const TEMPLATE = './test/resources/start.html';
const DATA = './test/resources/start.json';

describe('sta-mina', () => {
    describe('render static', () => {
        it('render demo page', () => {
            generator.statics(TEMPLATE, DATA);
        });
    });

    describe('render dynamic', () => {
        it('render demo page', () => {
            generator.dynamics(TEMPLATE, DATA);
        });
    });
});