document.addEventListener("DOMContentLoaded", () => {
  const { formatCurrency } = window.VAPTUtils;
  const { categories, products } = window.VAPT_DATA;

  const categoryRoot = document.querySelector("[data-home-categories]");
  const featuredRoot = document.querySelector("[data-home-products]");
  const miniRoot = document.querySelector("[data-home-mini]");

  if (categoryRoot) {
    categoryRoot.innerHTML = categories
      .map(
        (category) => `
          <a class="category-card" href="./products.html?category=${encodeURIComponent(category.name)}">
            <div class="category-icon">${category.icon}</div>
            <strong>${category.name}</strong>
            <span class="meta-text">Colecao com leitura comercial clara</span>
          </a>
        `
      )
      .join("");
  }

  if (featuredRoot) {
    featuredRoot.innerHTML = products
      .slice(0, 4)
      .map(
        (product) => `
          <a class="product-card" href="./product.html?slug=${product.slug}">
            <button class="icon-button product-favorite" type="button" aria-label="Favoritar" data-favorite>♡</button>
            <div class="product-thumb"><img src="${product.image}" alt="${product.title}" /></div>
            <div class="product-body">
              <span class="pill brand">${product.badge}</span>
              <h3 class="product-title">${product.title}</h3>
              <div class="price">${formatCurrency(product.price)}</div>
              <div class="installments">${product.installments}</div>
              <div class="meta-text">${product.store}</div>
            </div>
          </a>
        `
      )
      .join("");
  }

  if (miniRoot) {
    miniRoot.innerHTML = products
      .slice(0, 3)
      .map(
        (product) => `
          <a class="mini-row" href="./product.html?slug=${product.slug}">
            <div class="mini-thumb"><img src="${product.image}" alt="${product.title}" /></div>
            <div>
              <strong>${product.title}</strong>
              <div class="meta-text">${product.store}</div>
            </div>
            <strong>${formatCurrency(product.price)}</strong>
          </a>
        `
      )
      .join("");
  }
});
