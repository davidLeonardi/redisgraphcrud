import util = require('util');

interface CreateNodeArguments {
    label: string;
    data: any;
}

interface GetNodeArguments {
    label?: string;
    data: object;
    keysToReturn: string[];
}

export const createNodeQueryStringGenerator = (label: CreateNodeArguments['label'], data: CreateNodeArguments['data']) => {
    const queryString = `CREATE (n:${label} ${util.inspect(data)})`;
    return queryString;
};

export const createGetNodeByPropertyQueryStringGenerator = (label: GetNodeArguments['label'], data: GetNodeArguments['data'], keysToReturn: GetNodeArguments['keysToReturn']) => {
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
const generateWhereStatement = (propertiesToGenerateWhereStatementFor: GetNodeArguments['data']) => {
    let queryString = '';
    if (propertiesToGenerateWhereStatementFor) {
        Object.keys(propertiesToGenerateWhereStatementFor).forEach((objectKey, i) => {
            if (i === 0) {
                queryString = `WHERE (n.${objectKey} = '${propertiesToGenerateWhereStatementFor[objectKey]}'`;
            } else {
                queryString += ` AND n.${objectKey} = '${propertiesToGenerateWhereStatementFor[objectKey]}'`;
            }
        });
        queryString += ')';
    }

    return queryString;
};