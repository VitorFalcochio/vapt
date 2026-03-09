document.addEventListener("DOMContentLoaded", () => {
  const { slugFromUrl, formatCurrency, upsertCartItem } = window.VAPTUtils;
  const slug = slugFromUrl() || window.VAPT_DATA.products[0].slug;
  const product = window.VAPT_DATA.products.find((item) => item.slug === slug) || window.VAPT_DATA.products[0];

  const title = document.querySelector("[data-product-title]");
  const mainImage = document.querySelector("[data-product-main-image]");
  const gallery = document.querySelector("[data-product-gallery]");
  const category = document.querySelector("[data-product-category]");
  const rating = document.querySelector("[data-product-rating]");
  const reviews = document.querySelector("[data-product-reviews]");
  const price = document.querySelectorAll("[data-product-price]");
  const oldPrice = document.querySelector("[data-product-old-price]");
  const installments = document.querySelectorAll("[data-product-installments]");
  const stock = document.querySelector("[data-product-stock]");
  const description = document.querySelector("[data-product-description]");
  const store = document.querySelectorAll("[data-product-store]");
  const buyButtons = document.querySelectorAll("[data-add-cart]");

  document.title = `${product.title} | VAPT`;

  if (title) title.textContent = product.title;
  if (mainImage) {
    mainImage.src = product.image;
    mainImage.alt = product.title;
  }
  if (category) category.textContent = `${product.category} • ${product.badge}`;
  if (rating) rating.textContent = product.rating.toFixed(1);
  if (reviews) reviews.textContent = `${product.reviews} avaliacoes`;
  price.forEach((node) => {
    node.textContent = formatCurrency(product.price);
  });
  if (oldPrice) oldPrice.textContent = formatCurrency(product.oldPrice);
  installments.forEach((node) => {
    node.textContent = product.installments;
  });
  if (stock) stock.textContent = `Estoque disponivel: ${product.stock} unidades`;
  if (description) description.textContent = product.description;
  store.forEach((node) => {
    node.textContent = product.store;
  });

  if (gallery) {
    gallery.innerHTML = product.thumbnails
      .map(
        (image, index) => `
          <button class="gallery-thumb ${index === 0 ? "is-active" : ""}" type="button" data-thumb="${image}">
            <img src="${image}" alt="${product.title} ${index + 1}" />
          </button>
        `
      )
      .join("");

    gallery.querySelectorAll("[data-thumb]").forEach((button) => {
      button.addEventListener("click", () => {
        gallery.querySelectorAll(".gallery-thumb").forEach((thumb) => thumb.classList.remove("is-active"));
        button.classList.add("is-active");
        mainImage.src = button.getAttribute("data-thumb");
      });
    });
  }

  buyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      upsertCartItem(product.id, 1);
      window.showToast("Carrinho atualizado", `${product.title} foi adicionado.`);
    });
  });
});
