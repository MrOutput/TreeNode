# TreeNode

TreeNode is a generic OO tree ADT JS lib.

It has a high-level interface and has many iterators
like depth-first, breadth-first, and ancestor traversal. It has a nifty
toUL() method that converts a TreeNode to a DOM UL.

## Example

An object can be represented as a tree, and
its tree representation can be turned into a UL via toUL().
In this case, the tree acts as an abstraction layer between
the object, or any other TreeNode,
and the UL --- which is pretty nice since it keeps us from
writing the same code per use case --- No need to write 
a obj2ul function. Instead, we add a layer of abstraction
between the object and the ul, the TreeNode.

### Given

```js
var obj = {
    name: { first: "rafael", last: "cepeda" },
    age: 23,
    books: ["foo", "bar", "fooby"],
    school: { name: "UWF", state: "FL" },
    food: { name: "oranges", genre: "fruits" },
    beverage: "water"
};
```

### Demo

```js
var node = obj2tree(obj);
var ul;

ul = node.toUL(node.depth_descend);
document.getElementById("depth").appendChild(ul);

ul = node.toUL(node.breadth_descend);
document.getElementById("breadth").appendChild(ul);
```

### Output

![TreeNode Demo](https://github.com/MrOutput/TreeNode/blob/master/demo.png)

## High hopes

- Make all iterators generators for early termination.
- Add priorty-first iterator (will take user-defined comparator).
- Create search functions that take an iterator param.
- Easy construction
    - constructor that takes a collection
      and parent/child descriptors.
        - cycle detection

