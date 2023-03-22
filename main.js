const fs = require('fs');
const path = require('path');
const babylon = require('babylon') // 用于将源码转成AST
const traverse = require('babel-traverse').default // 遍历AST
const { transformFromAst } = require('babel-core') // babel核心 转换JS语法


const START_ID = 1000
let ID = START_ID

/**
 * 收集一个文件的依赖信息
 * @param {String} filename 文件名
 * @returns 
 */

let assetsMap = {}

async function createAsset(filename) {

    let module = assetsMap[filename]
    if (module) {
        return module
    }

    const dependencies = [];
    module = {
        id: ID++, // 当前模块的ID
        filename: filename, // 当前文件的路径
        code: undefined, // 转换后的代码
        dependencies: dependencies, // 依赖其他模块的路径
        mapping: {}, // 保存当前模块的依赖关系
        styles: [] // 保存引用的CSS模块信息
    }
    assetsMap[filename] = module

    let sourceCode = await new Promise(resolve => {
        fs.readFile(filename, {
            encoding: 'utf-8'
        }, (err, data) => {
            resolve(data)
        })
    })

    //1.将源码变成抽象语法树
    const ast = babylon.parse(sourceCode, {
        sourceType: 'module'
    })

    // 2.遍历抽象语法树， 找到所有的import信息，收集依赖

    traverse(ast, {
        ImportDeclaration({ node }) {
            let value = node.source.value
            if (value.endsWith('.js')) {
                dependencies.push(value) // js依赖
            } else if (value.endsWith('.css')) {
                module.styles.push(value) // css 依赖 后续未实现 
            }
        }
    })

    let { code } = transformFromAst(ast, null, {
        presets: ['env']
    })

    // 移除代码中的CSS module
    module.styles.forEach(style => {
        code = code.replace(`require("${style}")`, '')
    });
    module.code = code
    return module
}

/**
 * 根据文件信息生成模块依赖关系图
 * 
 * @param {Object} asset
 */
async function createGraph(entry) {
    let asset = await createAsset(entry);
    const queue = [asset]
    const graph = []
    while (queue.length) {
        let item = queue.shift();
        if (graph.find(it => it.id === item.id)) {
            continue
        }

        graph.push(item)
        const dirname = path.dirname(item.filename)

        for (let i = 0, len = item.dependencies.length; i < len; i++) {
            let relativePath = item.dependencies[i];
            let absolutePath = path.resolve(dirname, relativePath)
            let subAsset = await createAsset(absolutePath);
            item.mapping[relativePath] = subAsset.id

            // 没有的话才加入
            if (!queue.find(item => item.id === subAsset.id)) {
                queue.push(subAsset)
            }
        }
    }

    return graph
}

/**
 * 根据模块的依赖关系图进行打包
 * @param {} graph 依赖图
 */
function bundle(graph) {

    let modules = ''
    for (let i = 0, len = graph.length; i < len; i++) {
        let module = graph[i];

        module.dependencies.forEach(dependency => {
            module.code = module.code.replace(`require("${dependency}")`, `require(${module.mapping[dependency]})`) // 替换模块路径为模块的编号
        })
        modules += `${module.id}: function (require, module, exports){ ${module.code} }, `
    }

    // 注入自定义的require方法
    const code = `
    (function(modules) {
      const moduleCached = {};
      function require(id) {
        if (moduleCached[id]) {
            return moduleCached[id]
        }
        const fn = modules[id];
        const module = { exports : {} };
        fn(require, module, module.exports);
        moduleCached[id] = module.exports;
        return module.exports;
      }
      require(${START_ID});
    })({${modules}})
  `;

    return code
}

async function run() {
    let graph = await createGraph(path.resolve(process.cwd(), 'src/index.js')) // 分析入口文件 找到入口的依赖
    // console.log(graph)

    // 打包文件
    let code = bundle(graph);
    console.log(code)
    fs.writeFile('output.js', code, (err, data) => {
        // console.log(err)
    })

    // 把生成后的源码写入新的文件
}

run()