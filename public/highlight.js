const hash = window.location.hash;

if (hash) {
  const elemento = document.querySelector(hash);
  if (elemento) {
    elemento.classList.add("destacado");
    setTimeout(() => {
      elemento.classList.remove("destacado");
    }, 3000);
  }
}