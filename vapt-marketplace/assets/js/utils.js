function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function formatNumber(value) {
  return new Intl.NumberFormat("pt-BR").format(Number(value || 0));
}

function slugFromUrl() {
  return new URLSearchParams(window.location.search).get("slug");
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("vapt-cart") || "[]");
  } catch (error) {
    console.warn("Nao foi possivel ler o carrinho.", error);
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem("vapt-cart", JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("vapt:cart-updated", { detail: items }));
}

function updateCartCount() {
  const count = getCart().reduce((total, item) => total + Number(item.quantity || 0), 0);
  qsa("[data-cart-count]").forEach((node) => {
    node.textContent = count;
  });
}

function upsertCartItem(productId, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  saveCart(cart);
  updateCartCount();
}

function setCurrentYear() {
  qsa("[data-current-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setCurrentYear();
  updateCartCount();
});

window.VAPTUtils = {
  qs,
  qsa,
  formatCurrency,
  formatNumber,
  slugFromUrl,
  getCart,
  saveCart,
  updateCartCount,
  upsertCartItem,
};
