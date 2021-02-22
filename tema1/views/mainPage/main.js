async function makeSearch() {
    return await fetch('http://127.0.0.1:8128/', {method: 'POST', body: JSON.stringify()}).then(res => res.json())
}