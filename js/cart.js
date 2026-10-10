const cartOpen = document.querySelector("#cart-open");
const cartDialog = document.querySelector("#cart-dialog");
const cartClose = document.querySelector("#cart-close");
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const cartEmpty = document.querySelector("#cart-empty");
const cartTotal = document.querySelector("#cart-total");
const cartCheckout = document.querySelector("#cart-checkout");
const cartStatus = document.querySelector("#cart-status");
const cart = new Map();

function formatPrice(value) {
    return `S/ ${value.toFixed(2)}`;
}

function getCartQuantity() {
    return [...cart.values()].reduce((total, item) => total + item.quantity, 0);
}

function renderCart() {
    cartItems.replaceChildren();
    let total = 0;
    const quantity = getCartQuantity();

    cart.forEach((item) => {
        const lineTotal = item.price * item.quantity;
        total += lineTotal;

        const row = document.createElement("div");
        const details = document.createElement("div");
        const name = document.createElement("p");
        const price = document.createElement("span");
        const controls = document.createElement("div");
        const decrease = document.createElement("button");
        const quantityLabel = document.createElement("span");
        const increase = document.createElement("button");
        const remove = document.createElement("button");

        row.className = "cart-item";
        details.className = "cart-item-details";
        name.className = "cart-item-name";
        name.textContent = item.name;
        price.className = "cart-item-price";
        price.textContent = `${formatPrice(item.price)} c/u · ${formatPrice(lineTotal)}`;
        controls.className = "cart-item-controls";
        decrease.className = "cart-quantity-button";
        decrease.type = "button";
        decrease.setAttribute("aria-label", `Quitar una unidad de ${item.name}`);
        decrease.innerHTML = '<i class="fa-solid fa-minus" aria-hidden="true"></i>';
        decrease.addEventListener("click", () => updateQuantity(item.id, -1));
        quantityLabel.className = "cart-quantity";
        quantityLabel.textContent = String(item.quantity);
        increase.className = "cart-quantity-button";
        increase.type = "button";
        increase.setAttribute("aria-label", `Agregar una unidad de ${item.name}`);
        increase.innerHTML = '<i class="fa-solid fa-plus" aria-hidden="true"></i>';
        increase.addEventListener("click", () => updateQuantity(item.id, 1));
        remove.className = "cart-remove-button";
        remove.type = "button";
        remove.setAttribute("aria-label", `Eliminar ${item.name} del carrito`);
        remove.innerHTML = '<i class="fa-solid fa-trash" aria-hidden="true"></i>';
        remove.addEventListener("click", () => {
            cart.delete(item.id);
            renderCart();
            cartStatus.textContent = `${item.name} eliminado del carrito.`;
        });

        details.append(name, price);
        controls.append(decrease, quantityLabel, increase, remove);
        row.append(details, controls);
        cartItems.append(row);
    });

    cartCount.textContent = String(quantity);
    cartCount.setAttribute("aria-label", `${quantity} productos en el carrito`);
    cartEmpty.hidden = quantity > 0;
    cartTotal.textContent = formatPrice(total);
    cartCheckout.setAttribute("aria-disabled", String(quantity === 0));

    const message = [...cart.values()]
        .map((item) => `${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`)
        .join("\n");
    const whatsappUrl = new URL("https://wa.me/51924221113");
    whatsappUrl.searchParams.set("text", `Hola, quiero consultar por estos productos:\n${message}\nTotal: ${formatPrice(total)}`);
    cartCheckout.href = whatsappUrl.toString();
}

function updateQuantity(productId, change) {
    const item = cart.get(productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) cart.delete(productId);
    renderCart();
}

document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
    button.addEventListener("click", () => {
        const product = button.closest(".product-card");
        const details = product.querySelector(".card-body p");
        const name = [...details.childNodes]
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent)
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
        const priceText = details.querySelector("span")?.textContent ?? "";
        const price = Number(priceText.replace(/[^\d.]/g, ""));
        const item = cart.get(product.id) ?? { id: product.id, name, price, quantity: 0 };

        item.quantity += 1;
        cart.set(product.id, item);
        renderCart();
        cartStatus.textContent = `${name} agregado al carrito. ${getCartQuantity()} productos seleccionados.`;
    });
});

cartOpen.addEventListener("click", () => {
    renderCart();
    cartDialog.showModal();
});

cartClose.addEventListener("click", () => cartDialog.close());
cartDialog.addEventListener("click", (event) => {
    if (event.target === cartDialog) cartDialog.close();
});
cartDialog.addEventListener("close", () => cartOpen.focus());

renderCart();