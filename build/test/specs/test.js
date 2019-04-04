"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const utils_1 = require("../../utils");
describe('Basic Query String Generation', () => {
    it('generates the correct query for node creation', () => {
        const producedValue = utils_1.createNodeQueryStringGenerator('testLabel', { key: 'value' });
        chai_1.expect(producedValue).to.be.equal(`CREATE (n:testLabel { key: 'value' })`);
    });
    it('generates the correct query for node retrieval with one key', () => {
        const producedValue = utils_1.createGetNodeByPropertyQueryStringGenerator('testLabel', { key: 'value' });
        chai_1.expect(producedValue).to.be.equal(`MATCH (n:testLabel) WHERE (n.key = 'value') RETURN n`);
    });
    it('generates the correct query for node retrieval with multiple keys', () => {
        const producedValue = utils_1.createGetNodeByPropertyQueryStringGenerator('testLabel', { key: 'value', key2: 'value2' });
        chai_1.expect(producedValue).to.be.equal(`MATCH (n:testLabel) WHERE (n.key = 'value' AND n.key2 = 'value2') RETURN n`);
    });
});
//# sourceMappingURL=test.js.map