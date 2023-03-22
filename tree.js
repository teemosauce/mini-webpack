

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
                queue = queue.concat(child.children)
            }
        }
    }

    return node;
}

let tree = generateTree(300000)
let FIND_ID = 2000

console.time("递归调用查找耗时")
console.log(findNodeById(FIND_ID, tree))
console.timeEnd("递归调用查找耗时")

console.time("广度查找耗时")
console.log(findNodeById2(FIND_ID, tree))
console.timeEnd("广度查找耗时")

console.time("深度查找耗时")
console.log(findNodeById3(FIND_ID, tree))
console.timeEnd("深度查找耗时")



// { id: 2000, children: [ { id: 2001, children: [Array] } ] }
// 递归调用查找耗时: 4.247ms
// { id: 2000, children: [ { id: 2001, children: [Array] } ] }
// 广度查找耗时: 0.427ms
// { id: 2000, children: [ { id: 2001, children: [Array] } ] }
// 深度查找耗时: 0.422ms