import { expect } from 'chai';
import { createNodeQueryStringGenerator, createGetNodeByPropertyQueryStringGenerator } from '../..';

describe('Basic Query String Generation', () => {
  it('generates the correct query for node creation', () => {
    const producedValue = createNodeQueryStringGenerator('testLabel', {key: 'value'});
    expect(producedValue).to.be.equal(`CREATE (n:testLabel { key: 'value' }) RETURN n`);
  });

  it('generates the correct query for node retrieval with one key', () => {
    const producedValue = createGetNodeByPropertyQueryStringGenerator('testLabel', {key: 'value'});
    expect(producedValue).to.be.equal(`MATCH (n:testLabel) WHERE (n.key = 'value') RETURN n`);
  });

  it('generates the correct query for node retrieval with multiple keys', () => {
    const producedValue = createGetNodeByPropertyQueryStringGenerator('testLabel', {key: 'value', key2: 'value2'});
    expect(producedValue).to.be.equal(`MATCH (n:testLabel) WHERE (n.key = 'value' AND n.key2 = 'value2') RETURN n`);
  });
});