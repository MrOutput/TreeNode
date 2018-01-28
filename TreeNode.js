class TreeNode {
    constructor() {
        this.parent = null;
        this.value = null;
        this.children = [];
    }

    addChild(n) {
        n.parent = this;
        this.children.push(n);
        return n;
    }

    depth_descend(cb, _stack = []) {
        cb(this, _stack);

        this.children.forEach(c => {
            _stack.push(this);
            c.depth_descend(cb, _stack);
            _stack.pop();
        });
    }

    breadth_descend(cb, _queue = []) {
        //not ideal, needs work
        var stack = [];
        this.ascend((n, _stack) => stack = _stack);
        stack = stack.reverse();
        stack.pop();

        cb(this, stack);

        _queue = _queue.concat(this.children);
        if (_queue.length)
            this.breadth_descend.call(_queue.shift(), cb, _queue);
    }

    ascend(cb, _stack = []) {
        _stack.push(this);
        cb(this, _stack);
        if (this.isRoot() === false)
            this.ascend.call(this.parent, cb, _stack);
    }

    get firstChild() {
        return this.children[0];
    }

    isRoot() {
        return (this.parent === null);
    }

    get siblings() {
        return (this.isRoot()) ? [] : this.parent.children;
    }

    hasChildren() {
        return (this.children.length > 0);
    }

    toUL(iterator = this.depth_descend) {
        var last_genn = 0;
        var last_li;
        var ul = [document.createElement("ul")];

        iterator.call(this, (n, ancestry) => {
            var genn = ancestry.length;

            if (genn !== 0) {
                var li = document.createElement("li");
                li.textContent = n.value;

                if (genn > last_genn) {
                    add_child();
                } else if (genn < last_genn) {
                    add_ancestor();
                } else {
                    add_sibling();
                }
            }

            function add_child() {
                add_sibling();
            }

            function add_ancestor() {
                while (last_genn !== genn) {
                    ul.pop();
                    last_genn--;
                }
                add_sibling();
            }

            /*
            node.hasChildren() is insufficient.
            It makes the assumption that
            normal traversal is occuring.

            The safest and most accurate way to
            determine if a node has children,
            regardless of the iterator,
            is to lookahead on the current node
            or lookbehind on the next input node.

            In short, the iterator determines if a
            node has children, not the node's children[].

            A lookahead is a hassle, lookbehind it is.
            */
            function add_sibling() {
                var par = ul[ul.length-1];
                par.appendChild(li);
                /*
                The *right* question is:
                Am I a first child, not do I have children.
                */
                if (last_li && genn > last_genn) {
                    par = document.createElement("ul");
                    par.appendChild(li);
                    ul.push(par);
                    last_li.appendChild(par);
                }
            }

            last_genn = genn;
            last_li = li;
        });

        return ul[0];
    }
}

function obj2tree(o) {
    var parent = new TreeNode();

    if (o instanceof Array) {
        o.forEach(el => parent.addChild(obj2tree(el)));
    } else if (o instanceof Object) {
        for (var p in o) {
            var v = o[p];
            var c = parent.addChild(obj2tree(v));
            c.value = p;
            if (v instanceof Array === false &&
                v instanceof Object === false)
                c.value += `: ${v}`;
        }
    } else {
        parent.value = o.toString();
    }

    return parent;
}

var obj = {
    name: { first: "rafael", last: "cepeda" },
    age: 23,
    books: ["foo", "bar", "fooby"],
    school: { name: "UWF", state: "FL" },
    food: { name: "oranges", genre: "fruits" },
    beverage: "water"
};

var node = obj2tree(obj);
var ul;

ul = node.toUL(node.depth_descend);
document.getElementById("depth").appendChild(ul);

ul = node.toUL(node.breadth_descend);
document.getElementById("breadth").appendChild(ul);
