document.addEventListener("DOMContentLoaded", () => {
  const ordersRoot = document.querySelector("[data-customer-orders]");

  if (!ordersRoot) {
    return;
  }

  ordersRoot.innerHTML = window.VAPT_DATA.orders
    .map(
      (order) => `
        <tr>
          <td>${order.id}</td>
          <td>${order.store}</td>
          <td><span class="status ${order.deliveryStatus === "Entregue" ? "success" : "info"}">${order.deliveryStatus}</span></td>
          <td>${order.paymentMethod}</td>
          <td>${window.VAPTUtils.formatCurrency(order.total)}</td>
        </tr>
      `
    )
    .join("");
});
