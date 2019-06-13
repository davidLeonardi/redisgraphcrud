"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
exports.createNodeQueryStringGenerator = (label, data) => {
    const queryString = `CREATE (n:${label} ${util.inspect(data)})`;
    return queryString;
};
exports.createGetNodeByPropertyQueryStringGenerator = (label, data, keysToReturn) => {
    let keysToReturnStringList = '';
    keysToReturn.forEach((key, index, oringinalList) => {
        keysToReturnStringList = keysToReturnStringList + key;
        if (index !== oringinalList.length - 1) {
            keysToReturnStringList += ', ';
        }
    });
    const queryString = `MATCH (n${label ? `${':' + label}` : ''}) ${generateWhereStatement(data)} RETURN ${keysToReturnStringList}`;
    return queryString;
};
// Utility function to generate a filtering statement. A list of filtering criteria will be expanded into a WHERE ... AND ... statement
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
//# sourceMappingURL=utils.js.map