import { expect } from 'chai';
import { createNodeQueryStringGenerator, createGetNodeByPropertyQueryStringGenerator } from '../../utils';

describe('Basic Query String Generation', () => {
  it('generates the correct query for node creation', () => {
    const producedValue = createNodeQueryStringGenerator('testLabel', { key: 'value' });
    expect(producedValue).to.be.equal(`CREATE (n:testLabel { key: 'value' })`);
  });

  it('generates the correct query for node retrieval with one key', () => {
    const producedValue = createGetNodeByPropertyQueryStringGenerator('testLabel', { key: 'value' }, ['key']);
    expect(producedValue).to.be.equal(`MATCH (n:testLabel) WHERE (n.key = 'value') RETURN key`);
  });

  it('generates the correct query for node retrieval with multiple keys', () => {
    const producedValue = createGetNodeByPropertyQueryStringGenerator('testLabel', { key: 'value', key2: 'value2' }, ['key', 'key2']);
    expect(producedValue).to.be.equal(`MATCH (n:testLabel) WHERE (n.key = 'value' AND n.key2 = 'value2') RETURN key, key2`);
  });
});