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
const utils_1 = require("./utils");
// Create a new node
exports.createNode = (createNodeArguments, graphClient, retrieveKeys) => __awaiter(this, void 0, void 0, function* () {
    checkRedisGraphClient(graphClient);
    // Create a new node with a given label and a given data payload
    const { label, data } = createNodeArguments;
    return graphClient.query(utils_1.createNodeQueryStringGenerator(label, data))
        .then((res) => {
        return exports.getNodeByProperty(createNodeArguments, graphClient, retrieveKeys);
    });
});
// Get a node by any given property
exports.getNodeByProperty = (getNodeArguments, graphClient, retrieveKeys) => __awaiter(this, void 0, void 0, function* () {
    checkRedisGraphClient(graphClient);
    const { label, propertyObject } = getNodeArguments;
    return graphClient.query(utils_1.createGetNodeByPropertyQueryStringGenerator(label, propertyObject))
        .then((res) => {
        return getNodeValue(res, retrieveKeys);
    });
});
// Relate two nodes with a relation of a given type
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
// Utility function to retrieve a specified set of values from a given record set.
// The idea is that we will either return the specified keys or the entire object.
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
// Utility function to verify if the passed RedisGraph client provides the .query() method
const checkRedisGraphClient = (client) => {
    if (!client || !client.query) {
        throw new Error('RedisGraph client does not support the .query method. Please use a suitable client!');
    }
};
//# sourceMappingURL=index.js.map