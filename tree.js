

// {
//     value: 0
//     children: [{
//         value: 1,
//         children: [{value:2, children:[...]}]
//     }]
// }

/**
 * 生成一颗指定深度的树
 * @param {number} depth 深度
 *  
 */
function generateTree(depth) {
    let tree;
    let curNode, nextNode;
    for (let i = 0; i < depth; i++) {
        if (i == 0) {
            curNode = generateNode(i);
            tree = curNode
        }
        nextNode = generateNode(i + 1);
        curNode.children.push(nextNode);
        curNode.children.push(generateNode(Math.random()));
        curNode = nextNode
    }
    return tree
}
/**
 * 生成一个节点
 * @param {string} index 节点ID
 * @returns 
 */
function generateNode(index) {
    return {
        id: index,
        children: []
    }
}

// 查找树的算法

/**
 * 第一种 递归查找
 * 该算法有一个弊端 就是当树的深度过大时, 会导致递归调用次数过多，造成栈溢出（Maximum call stack size exceeded）
 * 
 * @param {String} id 要查找目标的ID
 * @param {Object} tree 要查找的树
 * @returns 
 */
function findNodeById(id, tree) {
    let children = Array.isArray(tree) ? tree : [tree]
    let node = null;
    for (let i = 0, len = children.length; i < len; i++) {
        let child = children[i]
        if (child.id == id) {
            node = child
            break
        } else {
            if (Array.isArray(child.children) && child.children.length > 0) {
                node = findNodeById(id, child.children)
                if (node) {
                    break
                }
            }
        }
    }
    return node
}


/**
 * 第二种 广度优先查找
 * 遍历每一个节点及其子节点
 * 
 * @param {String} id 要查找目标的ID
 * @param {Object} tree 要查找的树
 * @returns 
 */
function findNodeById2(id, tree) {
    let children = Array.isArray(tree) ? tree : [tree];
    let queue = [...children];
    let node = null;
    while (queue.length) {
        let child = queue.shift(); // 从前往后取
        if (child.id == id) {
            node = child
            break
        } else {
            if (Array.isArray(child.children) && child.children.length > 0) {
                queue = queue.concat(child.children) // 没遍历一层中的一个节点 ，就把当前节点的下层节点追加到队尾 以达到遍历一层 ，在遍历下一层
            }
        }
    }

    return node;
}


/**
 * 第三种 深度优先查找
 * 没遍历一个节点，如果这个节点有子节点，则直接先遍历其下面的子节点
 * 
 * @param {String} id 要查找目标的ID
 * @param {Object} tree 要查找的树
 * @returns 
 */
function findNodeById3(id, tree) {
    let children = Array.isArray(tree) ? tree : [tree];
    let queue = [...children];
    let node = null;
    while (queue.length) {
        let child = queue.pop(); // 从后往前取
        if (child.id == id) {
            node = child
            break
        } else {
            if (Array.isArray(child.children) && child.children.length > 0) {
                // console.log(child.children.reverse());
                queue = queue.concat(child.children)
            }
        }
    }
    return node;
}

/**
 * 遍历树的每一个节点，记录当前每一个节点的路径信息（不能改变树的结构）
 * @param {[Object]} tree 
 */
function formatTree(tree, parent) {
    let children = Array.isArray(tree) ? tree : [tree];
    parent = parent || {}
    children.forEach(child => {
        child.path = (parent.path || '/') + child.id + '/' // 根据当前节点信息计算路径
        if (Array.isArray(child.children) && child.children.length > 0) {
            child.children = formatTree(child.children, child);
        }
    })
    return children
}

let tree = generateTree(30)
console.log(tree);
let FIND_ID = 3

// console.time("递归调用查找耗时")
// console.log(findNodeById(FIND_ID, tree))
// console.timeEnd("递归调用查找耗时")

// console.time("广度查找耗时")
// console.log(findNodeById2(FIND_ID, tree))
// console.timeEnd("广度查找耗时")

console.log(formatTree(tree))

console.time("深度查找耗时")
console.log(findNodeById3(FIND_ID, tree))
console.timeEnd("深度查找耗时")



// { id: 2000, children: [ { id: 2001, children: [Array] } ] }
// 递归调用查找耗时: 4.247ms
// { id: 2000, children: [ { id: 2001, children: [Array] } ] }
// 广度查找耗时: 0.427ms
// { id: 2000, children: [ { id: 2001, children: [Array] } ] }
// 深度查找耗时: 0.422ms


let arr = [
    { id: 3, name: '部门3', pid: 1 },
    { id: 1, name: '部门1', pid: 0 },
    { id: 4, name: '部门4', pid: 3 },
    { id: 2, name: '部门2', pid: 1 },
    { id: 5, name: '部门5', pid: 4 },
]

/**
 * 数组转树（递归法）
 * @param {Array} array 
 * @param {String} parentId 根节点的父节点ID 默认为0
 * @returns 
 */
function arrayParseTree1(array, parentId) {
    parentId = parentId || 0
    let treeList = []
    for (let i = 0, len = arr.length; i < len; i++) {
        let item = arr[i];
        let item_id = item.id;
        let item_parent_id = item.pid;

        if (item_parent_id == parentId) {
            item.children = arrayParseTree1(array, item_id)
            treeList.push(item)
        }
    }
    return treeList;
}

/**
 * 数组转树（双循环法）
 * @param {Array} array 
 * @param {String} parentId 根节点的父节点ID 默认为0
 * @returns 
 */
function arrayParseTree2(array, parentId) {
    parentId = parentId || 0
    let map = {}
    for (let i = 0, len = arr.length; i < len; i++) {
        let item = arr[i];
        let item_parent_id = item.pid;
        if (!map[item_parent_id]) {
            map[item_parent_id] = {
                children: [item]
            }
        } else {
            map[item_parent_id].children.push(item)
        }

    }

    for (let parent_id in map) {
        let children = map[parent_id].children
        for (let i in children) {
            let item = children[i];
            let item_id = item.id;
            if (map[item_id]) {
                item.children = map[item_id].children
            } else {
                item.children = []
            }
        }
    }
    return map[parentId].children
}

/**
 * 数组转树 （双循环法）
 * @param {Array} array 
 * @param {String} parentId 根节点的父节点ID 默认为0
 * @returns 
 */
function arrayParseTree3(array, parentId) {
    parentId = parentId || 0
    let map = {
        [parentId]: {
            children: []
        }
    }
    for (let i = 0, len = arr.length; i < len; i++) {
        let item = arr[i];
        let item_id = item.id;

        if (!map[item_id]) {
            map[item_id] = {
                ...item,
                children: []
            }
        }
    }

    for (let i = 0, len = arr.length; i < len; i++) {
        let item = arr[i];
        let item_id = item.id;
        let item_parent_id = item.pid;
        map[item_parent_id].children.push(map[item_id])
    }

    return map[parentId].children
}

/**
 * 数组转树 （单循环法）
 * @param {Array} array 
 * @param {String} parentId 根节点的父节点ID 默认为0
 * @returns 
 */

function arrayParseTree4(array, parentId) {
    parentId = parentId || 0
    let map = {
        [parentId]: {
            children: []
        }
    }
    for (let i = 0, len = arr.length; i < len; i++) {
        let item = arr[i];
        let item_id = item.id;
        let item_parent_id = item.pid;
        if (!map[item_id]) {
            map[item_id] = {
                children: []
            }
        }

        map[item_id] = {
            ...item,
            children: map[item_id].children
        }

        if (!map[item_parent_id]) {
            map[item_parent_id] = {
                children: []
            }
        }
        map[item_parent_id].children.push(map[item_id])

    }
    console.log(map)
    return map[parentId].children
}
console.log(arrayParseTree1(JSON.parse(JSON.stringify(arr))))
console.log(arrayParseTree2(JSON.parse(JSON.stringify(arr))))
console.log(arrayParseTree3(JSON.parse(JSON.stringify(arr))))
console.log(arrayParseTree4(JSON.parse(JSON.stringify(arr))))


/**
 * 统一给树加上一个path path规则是父及path + 当前节点ID 例如0/1/3/4
 * @param {Object|Array} tree 
 */
function formatTree(tree) {
    tree = Array.isArray(tree) ? tree : [tree];

    let queue = [...tree];

    let _paths = {
        0: '/0'
    }
    while (queue.length) {
        let item = queue.shift();
        let item_id = item.id;
        let item_parent_id = item.pid;
        let item_path = `${_paths[item_parent_id]}/${item_id}`
        item.path = item_path
        _paths[item_id] = item_path
        if (Array.isArray(item.children) && item.children.length > 0) {
            queue = item.children.concat(queue)
        }
    }

    return tree
}

tree = formatTree(arrayParseTree4(JSON.parse(JSON.stringify(arr))))
console.log(JSON.stringify(tree))