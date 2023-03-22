import { add } from './index.js';

export function stringify(value) {
    return JSON.stringify(value)
}

export function addProxy() {
    add(...arguments)
}