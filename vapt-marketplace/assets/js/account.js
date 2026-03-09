document.addEventListener("DOMContentLoaded", () => {
  const addressRoot = document.querySelector("[data-account-addresses]");
  const ordersRoot = document.querySelector("[data-account-orders]");

  if (addressRoot) {
    addressRoot.innerHTML = window.VAPT_DATA.customer.addresses
      .map(
        (address) => `
          <article class="panel address-card">
            <strong>${address.label}</strong>
            <span>${address.street}</span>
            <span class="meta-text">${address.city} - ${address.state}</span>
            <span class="meta-text">CEP ${address.zipCode}</span>
          </article>
        `
      )
      .join("");
  }

  if (ordersRoot) {
    ordersRoot.innerHTML = window.VAPT_DATA.orders
      .map(
        (order) => `
          <article class="panel order-card">
            <div class="split-content">
              <strong>${order.id}</strong>
              <span class="status info">${order.deliveryStatus}</span>
            </div>
            <span>${order.store}</span>
            <span class="meta-text">${order.paymentMethod}</span>
            <strong>${window.VAPTUtils.formatCurrency(order.total)}</strong>
          </article>
        `
      )
      .join("");
  }
});
