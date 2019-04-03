# redisgraph.crud

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


`relateNodes(nodeProps, graphClient)`

  * `relatableNodeProps` -- an object containing the following keys:
    * `originNode` -- an object containing a `label` as a string and `data` as an object containing the node properties to match
    * `destinationNode` -- an object containing a `label` as a string and `data` as an object containing the node properties to match
    * `relationLabel` -- the label of the relation to create.
  * `graphClient` -- a redisGraph client which has a `.query()` method exposed

    Calling `relateNodes` will always create a relation of type (origin)-[:RELATION]->(destination)


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

createNode(originNode, client, ['name', 'age']);

destinationNode(destionationNode, client, ['name', 'age']);

relateNodes({originNode: originNode, destionationNode: destinationNode, relationLabel: "knows"}, client);
~~~


## Bugs and Issues

If you encounter any bugs or issues, feel free to [open an issue at
github](https://github.com/davidLeonardi/redisgraphcrud/issues) or send me an email to
<david.leonardi@gmail.com>. I also always like to hear from you, if you’re using my code.

## License

Copyright © [David Leonardi](https://github.com/davidLeonardi/) and
[contributors](https://github.com/davidLeonardi/redisgraphcrud/graphs/contributors).

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
