const accountOpen = document.querySelector("#account-open");
const accountDialog = document.querySelector("#account-dialog");
const accountClose = document.querySelector("#account-close");
const accountStatus = document.querySelector("#account-status");
const accountTabs = [...document.querySelectorAll(".account-tab")];
const accountPanels = [...document.querySelectorAll(".account-panel")];

accountOpen.addEventListener("click", () => {
    accountStatus.textContent = "";
    accountDialog.showModal();
});

accountClose.addEventListener("click", () => accountDialog.close());

accountDialog.addEventListener("click", (event) => {
    if (event.target === accountDialog) accountDialog.close();
});

accountDialog.addEventListener("close", () => accountOpen.focus());

accountTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
        accountTabs.forEach((item, tabIndex) => {
            const isActive = tabIndex === index;
            item.classList.toggle("is-active", isActive);
            item.setAttribute("aria-selected", String(isActive));
            accountPanels[tabIndex].hidden = !isActive;
        });
        accountStatus.textContent = "";
    });
});

document.querySelectorAll("[data-account-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        accountStatus.textContent = "La interfaz está lista, pero el acceso aún no está conectado. No se enviaron tus datos.";
    });
});