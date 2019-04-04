"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
exports.createNodeQueryStringGenerator = (label, data) => {
    const queryString = `CREATE (n:${label} ${util.inspect(data)})`;
    return queryString;
};
exports.createGetNodeByPropertyQueryStringGenerator = (label, data) => {
    const queryString = `MATCH (n${label ? `${':' + label}` : ''}) ${generateWhereStatement(data)} RETURN n`;
    return queryString;
};
const generateWhereStatement = (propertiesToGenerateWhereStatementFor) => {
    let queryString = '';
    if (propertiesToGenerateWhereStatementFor) {
        Object.keys(propertiesToGenerateWhereStatementFor).forEach((objectKey, i) => {
            if (i === 0) {
                queryString = `WHERE (n.${objectKey} = '${propertiesToGenerateWhereStatementFor[objectKey]}'`;
            }
            else {
                queryString += ` AND n.${objectKey} = '${propertiesToGenerateWhereStatementFor[objectKey]}'`;
            }
        });
        queryString += ')';
    }
    return queryString;
};
