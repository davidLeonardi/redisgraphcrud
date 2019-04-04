export interface RedisGraphClient {
    query(query: any): any;
}
interface CreateNodeArguments {
    label: string;
    data: any;
}
interface GetNodeArguments {
    label?: string;
    data: object;
}
interface RelationParameterTypes {
    originNode: GetNodeArguments;
    destinationNode: GetNodeArguments;
    relationLabel: string;
}
export declare const createNode: (createNodeArguments: CreateNodeArguments, graphClient: RedisGraphClient, retrieveKeys: string[]) => Promise<any>;
export declare const getNodeByProperty: (getNodeArguments: GetNodeArguments, graphClient: RedisGraphClient, retrieveKeys: string[]) => Promise<any>;
export declare const relateNodes: ({ originNode, destinationNode, relationLabel }: RelationParameterTypes, graphClient: RedisGraphClient) => Promise<any>;
export {};
