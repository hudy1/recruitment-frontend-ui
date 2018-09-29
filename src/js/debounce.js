export default function debounce(func) {
    let id = null;
    return function() {
        window.clearTimeout(id);
        id = window.setTimeout(func, 100);
    }
}