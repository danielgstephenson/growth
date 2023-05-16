export function range (n) { return [...Array(n).keys()] }
export function sum (array) { return array.reduce((a, b) => a + b, 0) }
export function clamp (a, b, x) { return Math.max(a, Math.min(b, x)) }
