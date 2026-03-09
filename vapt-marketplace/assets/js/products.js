document.addEventListener("DOMContentLoaded", () => {
  const { formatCurrency } = window.VAPTUtils;
  const params = new URLSearchParams(window.location.search);
  const query = (params.get("q") || "").toLowerCase();
  const category = params.get("category");
  const root = document.querySelector("[data-products-grid]");
  const resultLabel = document.querySelector("[data-products-result]");

  if (!root) {
    return;
  }

  const filtered = window.VAPT_DATA.products.filter((product) => {
    const matchesQuery = !query || product.title.toLowerCase().includes(query) || product.category.toLowerCase().includes(query);
    const matchesCategory = !category || product.category === category;
    return matchesQuery && matchesCategory;
  });

  if (resultLabel) {
    resultLabel.textContent = filtered.length
      ? `${filtered.length} produtos encontrados`
      : "Nenhum produto encontrado";
  }

  root.innerHTML = filtered.length
    ? filtered
        .map(
          (product) => `
            <a class="product-card" href="./product.html?slug=${product.slug}">
              <button class="icon-button product-favorite" type="button" aria-label="Favoritar" data-favorite>♡</button>
              <div class="product-thumb"><img src="${product.image}" alt="${product.title}" /></div>
              <div class="product-body">
                <span class="pill brand">${product.category}</span>
                <h3 class="product-title">${product.title}</h3>
                <div class="price">${formatCurrency(product.price)}</div>
                <div class="installments">${product.installments}</div>
                <div class="rating"><strong>${"★".repeat(4)}${product.rating >= 4.8 ? "★" : "☆"}</strong> ${product.rating}</div>
                <div class="meta-text">${product.store}</div>
              </div>
            </a>
          `
        )
        .join("")
    : `<div class="empty-state"><strong>Sem resultados nesta busca</strong><span class="meta-text">Ajuste os filtros ou tente outro termo.</span></div>`;
});
