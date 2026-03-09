(function initToastSystem() {
  function ensureContainer() {
    let container = document.querySelector("[data-toast-stack]");

    if (!container) {
      container = document.createElement("div");
      container.className = "toast-stack";
      container.setAttribute("data-toast-stack", "");
      document.body.appendChild(container);
    }

    return container;
  }

  window.showToast = function showToast(title, message = "") {
    const container = ensureContainer();
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
    container.appendChild(toast);
    window.setTimeout(() => toast.remove(), 3200);
  };
})();
