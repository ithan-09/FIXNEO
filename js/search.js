const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchStatus = document.querySelector("#search-status");
const productCards = [...document.querySelectorAll(".product-card")];

function normalizeText(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = normalizeText(searchInput.value);
    const matchingProduct = productCards.find((card) =>
        normalizeText(card.textContent).includes(query)
    );

    productCards.forEach((card) => card.classList.remove("search-result-found"));

    if (!matchingProduct) {
        searchStatus.textContent = "No encontramos ese producto.";
        return;
    }

    searchStatus.textContent = "";
    matchingProduct.classList.add("search-result-found");
    window.location.hash = matchingProduct.id;
    matchingProduct.scrollIntoView({ behavior: "smooth", block: "center" });
});

searchInput.addEventListener("input", () => {
    searchStatus.textContent = "";
});
