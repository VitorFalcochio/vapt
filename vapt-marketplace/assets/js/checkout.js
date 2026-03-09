document.addEventListener("DOMContentLoaded", () => {
  const { getCart, formatCurrency } = window.VAPTUtils;
  const paymentOptions = document.querySelectorAll("[data-payment-option]");
  const subtotalNode = document.querySelector("[data-checkout-subtotal]");
  const totalNode = document.querySelector("[data-checkout-total]");
  const submitButton = document.querySelector("[data-checkout-submit]");

  const total = getCart().reduce((sum, cartItem) => {
    const product = window.VAPT_DATA.products.find((entry) => entry.id === cartItem.productId);
    return product ? sum + product.price * cartItem.quantity : sum;
  }, 0);

  if (subtotalNode) subtotalNode.textContent = formatCurrency(total);
  if (totalNode) totalNode.textContent = formatCurrency(total);

  paymentOptions.forEach((option) => {
    option.addEventListener("click", () => {
      paymentOptions.forEach((item) => item.classList.remove("is-selected"));
      option.classList.add("is-selected");
      const input = option.querySelector("input");
      if (input) input.checked = true;
    });
  });

  if (submitButton) {
    submitButton.addEventListener("click", () => {
      window.showToast("Checkout preparado", "Fluxo visual revisado e pronto para integracao com backend.");
    });
  }
});
