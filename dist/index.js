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
exports.createNode = (createNodeArguments, graphClient, retrieveKeys) => __awaiter(this, void 0, void 0, function* () {
    checkRedisGraphClient(graphClient);
    const { label, data } = createNodeArguments;
    return graphClient.query(utils_1.createNodeQueryStringGenerator(label, data))
        .then((res) => {
        return exports.getNodeByProperty({ label: label, data: data }, graphClient, retrieveKeys);
    });
});
exports.getNodeByProperty = (getNodeArguments, graphClient, retrieveKeys) => __awaiter(this, void 0, void 0, function* () {
    checkRedisGraphClient(graphClient);
    const { label, data } = getNodeArguments;
    return graphClient.query(utils_1.createGetNodeByPropertyQueryStringGenerator(label, data, retrieveKeys))
        .then((res) => {
        return getNodeValue(res, retrieveKeys);
    });
});
exports.relateNodes = ({ originNode, destinationNode, relationLabel }, graphClient) => __awaiter(this, void 0, void 0, function* () {
    checkRedisGraphClient(graphClient);
    const query = `MATCH (n1:${originNode.label} ${util.inspect(originNode.data)}), (n2:${destinationNode.label} ${destinationNode.data ? util.inspect(destinationNode.data) : ''}) CREATE (n1)-[r:${relationLabel}]->(n2)`;
    return graphClient.query(query)
        .then(() => {
        return exports.getRelation({ originNode, destinationNode, relationLabel }, graphClient);
    });
});
exports.getRelation = ({ originNode, destinationNode, relationLabel }, graphClient) => __awaiter(this, void 0, void 0, function* () {
    checkRedisGraphClient(graphClient);
    const query = `MATCH (n1:${originNode.label} ${util.inspect(originNode.data)})-[r:${relationLabel}]->(n2:${destinationNode.label} ${destinationNode.data ? util.inspect(destinationNode.data) : ''}) RETURN n1, n2, TYPE(r)`;
    return graphClient.query(query)
        .then((res) => {
        let result = {};
        while (res.hasNext()) {
            const record = res.next();
            result = {
                relationType: record.getString('TYPE(r)'),
                originId: record.getString('n1.id'),
                destinationId: record.getString('n2.id')
            };
        }
        return result;
    });
});
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
