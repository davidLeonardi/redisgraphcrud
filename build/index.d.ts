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
interface RelationParameterTypes {
    originNode: GetNodeArguments;
    destinationNode: GetNodeArguments;
    relationLabel: string;
}
export declare const createNode: (createNodeArguments: CreateNodeArguments, graphClient: RedisGraphClient, retrieveKeys: string[]) => Promise<any>;
export declare const createNodeQueryStringGenerator: (label: string, data: any) => string;
export declare const getNodeByProperty: (getNodeArguments: GetNodeArguments, graphClient: RedisGraphClient, retrieveKeys: string[]) => Promise<any>;
export declare const createGetNodeByPropertyQueryStringGenerator: (label: string, propertyObject: object) => string;
export declare const relateNodes: ({ originNode, destinationNode, relationLabel }: RelationParameterTypes, graphClient: RedisGraphClient) => Promise<any>;
export {};
