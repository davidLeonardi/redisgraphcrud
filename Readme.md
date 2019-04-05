# redisgraphcrud

offers a functional CRUD API for RedisGraph by wrapping any redisgraph client `.query()` interface

## Installation

    npm install redisgraphcrud

## API


`createNode(nodeDescriptor, graphClient, retrieveKeys)`

  * `nodeDescriptor` -- an object containing a `label` as a string and `data` as an object containing the node properties to set
  * `graphClient` -- a redisGraph client which has a `.query()` method exposed
  * `retrieveKeys` -- an array of strings which describes which keys of the node should be returned once the node has been created

    Call `createNode` with `retrieveKeys` set to a falsy value to not return anything after creation.


`getNodeByProperty(getNodeArguments, graphClient, retrieveKeys)`
  
  * `getNodeArguments` -- an object containing a `label` as a string and `data` as an object containing the node properties to match
  * `graphClient` -- a redisGraph client which has a `.query()` method exposed
  * `retrieveKeys` -- an array of strings which describes which keys of the node should be returned once the node has been created

    Call `getNodeByProperty` with `retrieveKeys` set to a falsy value to not return anything after retrieval.


`relateNodes(relatableNodeProps, graphClient)`

  * `relatableNodeProps` -- an object containing the following keys:
    * `originNode` -- an object containing a `label` as a string and `data` as an object containing the node properties to match
    * `destinationNode` -- an object containing a `label` as a string and `data` as an object containing the node properties to match
    * `relationLabel` -- the label of the relation to create as a string
  * `graphClient` -- a redisGraph client which has a `.query()` method exposed

    Calling `relateNodes` will always create a relation of type (origin)-[:RELATION]->(destination)


`getRelation(relatableNodeProps, graphClient)`

  * `relatableNodeProps` -- an object containing the following keys:
    * `originNode` -- an object containing a `label` as a string and `data` as an object containing the node properties to match
    * `destinationNode` -- an object containing a `label` as a string and `data` as an object containing the node properties to match
    * `relationLabel` -- the label of the relation to create as a string
  * `graphClient` -- a redisGraph client which has a `.query()` method exposed


## Example

~~~ javascript
import {RedisGraph} from 'redisgraph.js';
const client = new RedisGraph();

import {createNode, getNodeByProperty, relateNodes} from 'redisgraphcrud';

const originNode = {
    label: "Person",
    data: {
        name: "Bob",
        age: 33
    }
}

const destinationNode = {
    label: "Person",
    data: {
        name: "Mary",
        age: 32
    }
}

// Create a person Bob
createNode(originNode, client, ['name', 'age']);

// Create a person called Mary
createNode(destionationNode, client, ['name', 'age']);

// Create a relation expressing that Bob knows Mary
relateNodes({originNode: originNode, destionationNode: destinationNode, relationLabel: "knows"}, client);

// Retrieve a relation given two vertices and a specific edge label
getRelation({originNode: originNode, destionationNode: destinationNode, relationLabel: "knows"}, client);
~~~


## Bugs and Issues

If you encounter any bugs or issues, feel free to [open an issue at
github](https://github.com/davidLeonardi/redisgraphcrud/issues) or send me an email to
<david.leonardi@gmail.com>. I also always like to hear from you, if you’re using my code.

## License

redisgraph.js is distributed under the BSD3 license - see [LICENSE](LICENSE)

