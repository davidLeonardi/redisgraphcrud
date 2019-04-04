import util = require('util');

interface CreateNodeArguments {
    label: string;
    data: any;
}

interface GetNodeArguments {
    label?: string;
    propertyObject: object;
}

export const createNodeQueryStringGenerator = (label: CreateNodeArguments['label'], data: CreateNodeArguments['data']) => {
    const queryString = `CREATE (n:${label} ${util.inspect(data)})`;
    return queryString;
};

export const createGetNodeByPropertyQueryStringGenerator = (label: GetNodeArguments['label'], propertyObject: GetNodeArguments['propertyObject']) => {
    const queryString = `MATCH (n${label ? `${':' + label}` : ''}) ${generateWhereStatement(propertyObject)} RETURN n`;
    return queryString;
};

// Utility function to generate a filtering statement. A list of filtering criteria will be expanded into a WHERE ... AND ... statement
const generateWhereStatement = (propertiesToGenerateWhereStatementFor: GetNodeArguments['propertyObject']) => {
    let queryString = '';
    Object.keys(propertiesToGenerateWhereStatementFor).forEach((objectKey, i) => {
        if (i === 0) {
            queryString = `WHERE (n.${objectKey} = '${propertiesToGenerateWhereStatementFor[objectKey]}'`;
        } else {
            queryString += ` AND n.${objectKey} = '${propertiesToGenerateWhereStatementFor[objectKey]}'`;
        }
    });
    queryString += ')';

    return queryString;
};