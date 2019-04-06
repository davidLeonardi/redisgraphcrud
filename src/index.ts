import util = require('util');
import {createGetNodeByPropertyQueryStringGenerator, createNodeQueryStringGenerator} from './utils';

export interface RedisGraphClient {
    query(query: any): any;
}

interface CreateNodeArguments {
    label: string;
    data?: any;
}

interface GetNodeArguments {
    label?: string;
    data?: object;
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
        return getNodeByProperty({label: label, data: data}, graphClient, retrieveKeys);
    });
};


// Get a node by any given property
export const getNodeByProperty = async (getNodeArguments: GetNodeArguments, graphClient: RedisGraphClient, retrieveKeys: GetNodeValueArguments['keys']) => {
    checkRedisGraphClient(graphClient);

    const {label, data} = getNodeArguments;

    return graphClient.query(createGetNodeByPropertyQueryStringGenerator(label, data))
    .then((res: any) => {
        return getNodeValue(res, retrieveKeys);
    });
};

// Relate two nodes with a relation of a given type
export const relateNodes = async ({ originNode, destinationNode, relationLabel}: RelationParameterTypes, graphClient: RedisGraphClient) => {
    checkRedisGraphClient(graphClient);

    const query = `MATCH (n1:${originNode.label} ${util.inspect(originNode.data)}), (n2:${destinationNode.label} ${destinationNode.data ? util.inspect(destinationNode.data) : ''}) CREATE (n1)-[r:${relationLabel}]->(n2)`;

    return graphClient.query(query)
    .then(() => {
        return getRelation({originNode, destinationNode, relationLabel}, graphClient);
    });
};

export const getRelation = async ({ originNode, destinationNode, relationLabel}: RelationParameterTypes, graphClient: RedisGraphClient) => {
    checkRedisGraphClient(graphClient);

    const query = `MATCH (n1:${originNode.label} ${util.inspect(originNode.data)})-[r:${relationLabel}]->(n2:${destinationNode.label} ${destinationNode.data ? util.inspect(destinationNode.data) : ''}) RETURN n1, n2, TYPE(r)`;
    return graphClient.query(query)
    .then((res: any) => {
        let result = {} as EstablishedRelationResult;
        while (res.hasNext()) {
            const record = res.next();
            result = {
                relationType: record.getString('TYPE(r)')
            };
        }
        return result;
    });
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