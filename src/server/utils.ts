export function newlineReplace(str) {
    return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
}