document.addEventListener("DOMContentLoaded", () => {
  const { getCart, saveCart, formatCurrency } = window.VAPTUtils;
  const itemsRoot = document.querySelector("[data-cart-items]");
  const summarySubtotal = document.querySelector("[data-cart-subtotal]");
  const summaryTotal = document.querySelector("[data-cart-total]");

  function render() {
    if (!itemsRoot) {
      return;
    }

    const cart = getCart();
    const products = cart
      .map((item) => {
        const product = window.VAPT_DATA.products.find((entry) => entry.id === item.productId);
        return product ? { ...product, quantity: item.quantity } : null;
      })
      .filter(Boolean);

    const subtotal = products.reduce((total, item) => total + item.price * item.quantity, 0);

    if (!products.length) {
      itemsRoot.innerHTML = `<div class="empty-state"><strong>Seu carrinho esta vazio</strong><span class="meta-text">Adicione produtos para continuar o checkout.</span></div>`;
    } else {
      itemsRoot.innerHTML = products
        .map(
          (product) => `
            <article class="cart-item">
              <div class="cart-item-thumb"><img src="${product.image}" alt="${product.title}" /></div>
              <div class="cart-item-meta">
                <span class="pill brand">${product.category}</span>
                <strong>${product.title}</strong>
                <span class="meta-text">${product.store}</span>
                <div class="quantity-control">
                  <button type="button" data-qty-minus="${product.id}">-</button>
                  <span>${product.quantity}</span>
                  <button type="button" data-qty-plus="${product.id}">+</button>
                </div>
              </div>
              <div class="stack">
                <strong>${formatCurrency(product.price * product.quantity)}</strong>
                <button class="ghost-button" type="button" data-remove="${product.id}">Remover</button>
              </div>
            </article>
          `
        )
        .join("");
    }

    if (summarySubtotal) summarySubtotal.textContent = formatCurrency(subtotal);
    if (summaryTotal) summaryTotal.textContent = formatCurrency(subtotal);

    itemsRoot.querySelectorAll("[data-qty-minus]").forEach((button) => {
      button.addEventListener("click", () => updateQuantity(button.getAttribute("data-qty-minus"), -1));
    });
    itemsRoot.querySelectorAll("[data-qty-plus]").forEach((button) => {
      button.addEventListener("click", () => updateQuantity(button.getAttribute("data-qty-plus"), 1));
    });
    itemsRoot.querySelectorAll("[data-remove]").forEach((button) => {
      button.addEventListener("click", () => removeItem(button.getAttribute("data-remove")));
    });
  }

  function updateQuantity(productId, delta) {
    const cart = getCart()
      .map((item) => (item.productId === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
      .filter((item) => item.quantity > 0);
    saveCart(cart);
    render();
  }

  function removeItem(productId) {
    saveCart(getCart().filter((item) => item.productId !== productId));
    render();
  }

  render();
});
