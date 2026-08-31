async function showFlash() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("flash")

    if (!code) return;

    const answer = await fetch("/messages");
    const messages = await answer.json();

    const paragraph = document.createElement("p");
    paragraph.classList.add("toast")
    paragraph.textContent = messages[code] || code;
    document.body.prepend(paragraph)
    setTimeout(() => {
        paragraph.remove()
    }, 3000)    
}

showFlash();
