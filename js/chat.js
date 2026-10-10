const chatWidget = document.querySelector(".chat-widget");
const chatWindow = document.querySelector("#chat-window");
const chatToggle = document.querySelector("#chat-toggle");
const chatClose = document.querySelector("#chat-close");
const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");
const chatMessages = document.querySelector("#chat-messages");

function normalizeChatText(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function addChatMessage(text, sender) {
    const message = document.createElement("div");
    const paragraph = document.createElement("p");
    message.className = `chat-message chat-message-${sender}`;
    paragraph.textContent = text;
    message.append(paragraph);
    chatMessages.append(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getChatAnswer(question) {
    const text = normalizeChatText(question);
    const products = [...document.querySelectorAll(".product-card")].map((card) => {
        const details = card.querySelector(".card-body p");
        const name = [...(details?.childNodes ?? [])]
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent)
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
        const price = details?.querySelector("span")?.textContent.trim();
        return { name, details: [name, price].filter(Boolean).join(" ") };
    });
    const services = [...document.querySelectorAll("#nuestro_servicios .lo_servi")].map((item) =>
        item.textContent.replace(/\s+/g, " ").trim()
    );

    const matchingProduct = products.find((product) =>
        text.includes(normalizeChatText(product.name))
    );

    if (matchingProduct) {
        return `${matchingProduct.details}. Puedes comprarlo desde la sección Productos.`;
    }

    if (/\b(hola|buenas|buenos dias|buenas tardes|buenas noches)\b/.test(text)) {
        return "¡Hola! Puedo ayudarte con productos y precios, reparaciones, horarios, ubicación y contacto. ¿Qué te gustaría consultar?";
    }

    if (/\b(productos?|catalogo|accesorios|precios?|cuanto cuesta|cuanto valen)\b/.test(text)) {
        const productList = products.map((product) => product.details.replace(/\s+/g, " ").trim());
        return `Estos son algunos de nuestros productos:\n${productList.join("\n")}`;
    }

    if (/\b(servicios?|reparacion|reparar|pantalla|bateria|liberacion|fallas?)\b/.test(text)) {
        return services.length
            ? `Ofrecemos estos servicios: ${services.join("; ")}. Para cotizar tu equipo, escríbenos por WhatsApp.`
            : "Puedes consultarnos por nuestros servicios desde WhatsApp.";
    }

    if (/\b(garantia|garantias|calidad|domicilio|recogen|recoger)\b/.test(text)) {
        const promises = [...document.querySelectorAll("#calidad .promesas")]
            .map((item) => item.textContent.replace(/\s+/g, " ").trim());
        return promises.length
            ? `En FIXNEO contamos con: ${promises.join(". ")}`
            : "Consulta las condiciones de garantía directamente con nuestro equipo por WhatsApp.";
    }

    if (/\b(horario|hora|abren|abierto|atienden|cierran|domingo|sabado)\b/.test(text)) {
        return "Atendemos de lunes a sábado de 9:00 a. m. a 9:00 p. m. y los domingos de 10:00 a. m. a 2:00 p. m.";
    }

    if (/\b(direccion|ubicacion|donde|tienda|local|llegar)\b/.test(text)) {
        return "Estamos en Av. Cajamarca, galería Grau, Local 42.";
    }

    if (/\b(contacto|telefono|llamar|whatsapp|numero|comunicar)\b/.test(text)) {
        return "Puedes llamarnos al +51 924 221 113 o escribirnos por WhatsApp con el botón de contacto de este chat.";
    }

    return "No encontré esa información en la página. Puedo ayudarte con productos, precios, reparaciones, horarios, ubicación o contacto. También puedes escribirnos por WhatsApp desde aquí.";
}

function setChatOpen(isOpen) {
    chatWindow.hidden = !isOpen;
    chatWidget.classList.toggle("is-open", isOpen);
    chatToggle.setAttribute("aria-expanded", String(isOpen));
    chatToggle.setAttribute("aria-label", isOpen ? "Cerrar chat de FIXNEO" : "Abrir chat de FIXNEO");

    if (isOpen) chatInput.focus();
}

chatToggle.addEventListener("click", () => setChatOpen(chatWindow.hidden));
chatClose.addEventListener("click", () => {
    setChatOpen(false);
    chatToggle.focus();
});

chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = chatInput.value.trim();
    if (!question) return;

    addChatMessage(question, "user");
    addChatMessage(getChatAnswer(question), "bot");
    chatForm.reset();
    chatInput.focus();
});

document.querySelectorAll("[data-chat-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
        chatInput.value = button.dataset.chatPrompt;
        chatForm.requestSubmit();
    });
});