"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
exports.createNode = (createNodeArguments, graphClient, retrieveKeys) => __awaiter(this, void 0, void 0, function* () {
    checkRedisGraphClient(graphClient);
    const { label, data } = createNodeArguments;
    return graphClient.query(exports.createNodeQueryStringGenerator(label, data))
        .then((res) => {
        return getNodeValue(res, retrieveKeys);
    });
});
exports.createNodeQueryStringGenerator = (label, data) => {
    const queryString = `CREATE (n:${label} ${util.inspect(data)}) RETURN n`;
    return queryString;
};
exports.getNodeByProperty = (getNodeArguments, graphClient, retrieveKeys) => __awaiter(this, void 0, void 0, function* () {
    checkRedisGraphClient(graphClient);
    const { label, propertyObject } = getNodeArguments;
    return graphClient.query(exports.createGetNodeByPropertyQueryStringGenerator(label, propertyObject))
        .then((res) => {
        return getNodeValue(res, retrieveKeys);
    });
});
exports.createGetNodeByPropertyQueryStringGenerator = (label, propertyObject) => {
    const queryString = `MATCH (n${label ? `${':' + label}` : ''}) ${generateWhereStatement(propertyObject)} RETURN n`;
    return queryString;
};
exports.relateNodes = ({ originNode, destinationNode, relationLabel }, graphClient) => __awaiter(this, void 0, void 0, function* () {
    checkRedisGraphClient(graphClient);
    const query = `MATCH (n1:${originNode.label} ${util.inspect(originNode.propertyObject)}), (n2:${destinationNode.label} ${util.inspect(destinationNode.propertyObject)}) CREATE (n1)-[r:${relationLabel}]->(n2) RETURN TYPE(r)`;
    return graphClient.query(query)
        .then((res) => {
        let result = {};
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
});
const generateWhereStatement = (propertiesToGenerateWhereStatementFor) => {
    let queryString = '';
    Object.keys(propertiesToGenerateWhereStatementFor).forEach((objectKey, i) => {
        if (i === 0) {
            queryString = `WHERE (n.${objectKey} = '${propertiesToGenerateWhereStatementFor[objectKey]}'`;
        }
        else {
            queryString += ` AND n.${objectKey} = '${propertiesToGenerateWhereStatementFor[objectKey]}'`;
        }
    });
    queryString += ')';
    return queryString;
};
const getNodeValue = (res, retrieveKeys) => __awaiter(this, void 0, void 0, function* () {
    let result;
    while (res.hasNext()) {
        const record = res.next();
        const getKeys = retrieveKeys || Object.keys(res);
        result = getKeys.reduce(function (result, key) {
            result[key] = record.getString(`n.${key}`);
            return result;
        }, {});
    }
    return result;
});
const checkRedisGraphClient = (client) => {
    if (!client || !client.query) {
        throw new Error('RedisGraph client does not support the .query method. Please use a suitable client!');
    }
};
