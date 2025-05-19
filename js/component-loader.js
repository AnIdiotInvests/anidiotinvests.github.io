async function loadComponents() {
    const components = new Map([
        ["get-head", "/components/header.html"],
        ["get-foot", "/components/footer.html"],
    ]);
    for (const [key, value] of components) {
        document.getElementById(key).innerHTML = await fetchHtml(value)
    }
}

async function fetchHtml(loc) {
    response = await fetch(loc);
    return await response.text();
}
