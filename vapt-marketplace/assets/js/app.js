document.addEventListener("DOMContentLoaded", () => {
  const { qsa } = window.VAPTUtils;

  qsa("[data-menu-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      document.body.classList.toggle("menu-open");
    });
  });

  qsa("[data-search-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.querySelector("input[name='q']");
      const query = input ? input.value.trim() : "";
      const targetUrl = new URL("./products.html", window.location.href);

      if (query) {
        targetUrl.searchParams.set("q", query);
      }

      window.location.href = `${targetUrl.pathname}${targetUrl.search}`;
    });
  });

  qsa("[data-favorite]").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("is-active");
      button.textContent = button.classList.contains("is-active") ? "♥" : "♡";
      window.showToast("Favoritos", "Produto salvo na sua lista.");
    });
  });

  window.addEventListener("vapt:cart-updated", () => {
    window.VAPTUtils.updateCartCount();
  });
});
