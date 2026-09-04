

const buttons = document.querySelectorAll(".btn-share");

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const idTorneo = button.dataset.torneoId;
        const url = `${window.location.origin}/#torneo-${idTorneo}`;
        const esTactil = navigator.maxTouchPoints > 0;

        if (navigator.share && esTactil) {
            navigator.share({ url })
                .catch(() => {
                    navigator.clipboard.writeText(url);

                    const paragraph = document.createElement("p");
                    paragraph.classList.add("toast");
                    paragraph.textContent = "Link copiado";
                    document.body.prepend(paragraph);
                    setTimeout(() => {
                        paragraph.remove();
                    }, 3000);
                });
        } else {
            navigator.clipboard.writeText(url);

            const paragraph = document.createElement("p");
            paragraph.classList.add("toast");
            paragraph.textContent = "Link copiado";
            document.body.prepend(paragraph);
            setTimeout(() => {
                paragraph.remove();
            }, 3000);
        }

    })
})