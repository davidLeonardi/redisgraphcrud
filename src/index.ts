export interface RedisGraphClient {
    query(query: any): any;
}

interface CreateNodeArguments {
    label: string;
    data: any;
}

interface GetNodeArguments {
    label?: string;
    propertyObject: object;
}

interface GetNodeValueArguments {
    keys: string[];
}

interface RelationParameterTypes {
    originNode: GetNodeArguments;
    destinationNode: GetNodeArguments;
    relationLabel: string;
}

interface EstablishedRelationResult {
    relationType: string;
}

// Create a new node
export const createNode = async(createNodeArguments: CreateNodeArguments, graphClient: RedisGraphClient, retrieveKeys: GetNodeValueArguments['keys']) => {
    checkRedisGraphClient(graphClient);

    // Create a new node with a given label and a given data payload
    const {label, data} = createNodeArguments;

    return graphClient.query(createNodeQueryStringGenerator(label, data))
    .then((res: any) => {
        return getNodeValue(res, retrieveKeys);
    });
};

export const createNodeQueryStringGenerator = (label: CreateNodeArguments['label'], data: CreateNodeArguments['data']) => {
    const queryString = `CREATE (n:${label} ${JSON.stringify(data)}) RETURN n`;
    return queryString;
};

// Get a node by any given property
export const getNodeByProperty = async (getNodeArguments: GetNodeArguments, graphClient: RedisGraphClient, retrieveKeys: GetNodeValueArguments['keys']) => {
    checkRedisGraphClient(graphClient);

    const {label, propertyObject} = getNodeArguments;

    return graphClient.query(createGetNodeByPropertyQueryStringGenerator(label, propertyObject))
    .then((res: any) => {
        return getNodeValue(res, retrieveKeys);
    });
};

export const createGetNodeByPropertyQueryStringGenerator = (label: GetNodeArguments['label'], propertyObject: GetNodeArguments['propertyObject']) => {
    const queryString = `MATCH (n${label ? `${':' + label}` : ''}) ${generateWhereStatement(propertyObject)} RETURN n`;
    return queryString;
};

// Relate two nodes with a relation of a given type
export const relateNodes = async ({ originNode, destinationNode, relationLabel}: RelationParameterTypes, graphClient: RedisGraphClient) => {
    checkRedisGraphClient(graphClient);

    const query = `MATCH (n1:${originNode.label} ${JSON.stringify(originNode.propertyObject)}), (n2:${destinationNode.label} ${JSON.stringify(destinationNode.propertyObject)}) CREATE (n1)-[r:${relationLabel}]->(n2) RETURN TYPE(r)`;

    return graphClient.query(query)
    .then((res: any) => {
        let result = {} as EstablishedRelationResult;
        console.log(res);
        while (res.hasNext()) {
            const record = res.next();
            result = {
                relationType: record.getString('TYPE(r)')
            };
        }
        console.log(result);
        return result;
    });
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

// Utility function to retrieve a specified set of values from a given record set.
// The idea is that we will either return the specified keys or the entire object.
const getNodeValue = async (res: any, retrieveKeys: GetNodeValueArguments['keys']) => {
    let result: any;
    while (res.hasNext()) {
        const record = res.next();
        const getKeys = retrieveKeys || Object.keys(res);
        result = getKeys.reduce(function(result, key) {
            result[key] = record.getString(`n.${key}`);
            return result;
        }, {});
    }
    return result;
};

// Utility function to verify if the passed RedisGraph client provides the .query() method
const checkRedisGraphClient = (client) => {
    if (!client || !client.query) {
        throw new Error('RedisGraph client does not support the .query method. Please use a suitable client!');
    }
};