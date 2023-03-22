import './style/common.css'

import { print, add } from "./utils/index.js";
import { stringify } from "./utils/parse.js";


const a = 'hello';
const b = 'world';
const c = add(a, b);

print(stringify(c));