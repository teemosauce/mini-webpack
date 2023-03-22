import { stringify } from "./parse.js";
export function add(x, y) {
    return x +' ' + y;
}

export function print(message) {
    console.log(stringify(message));
}