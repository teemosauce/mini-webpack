
    (function(modules) {
      function require(id) {
        const fn = modules[id];
        const module = { exports : {} };
        fn(require, module, module.exports);
        return module.exports;
      }
      require(1000);
    })({1000: function (require, module, exports){ "use strict";

;

var _index = require(1001);

var _parse = require(1002);

var a = 'hello';
var b = 'world';
var c = (0, _index.add)(a, b);

(0, _index.print)((0, _parse.stringify)(c)); }, 1001: function (require, module, exports){ "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.print = print;

var _parse = require(1002);

function add(x, y) {
  return x + ' ' + y;
}

function print(message) {
  console.log((0, _parse.stringify)(message));
} }, 1002: function (require, module, exports){ "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringify = stringify;
function stringify(value) {
  return JSON.stringify(value);
} }, })
  