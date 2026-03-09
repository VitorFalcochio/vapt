document.addEventListener("DOMContentLoaded", () => {
  const { adminMetrics, orders } = window.VAPT_DATA;
  const metricsRoot = document.querySelector("[data-admin-metrics]");
  const ordersRoot = document.querySelector("[data-admin-orders]");
  const logsRoot = document.querySelector("[data-admin-logs]");

  if (metricsRoot) {
    metricsRoot.innerHTML = `
      <article class="panel metric-card"><strong>Usuarios</strong><div class="price">${window.VAPTUtils.formatNumber(adminMetrics.users)}</div></article>
      <article class="panel metric-card"><strong>Lojas</strong><div class="price">${adminMetrics.stores}</div></article>
      <article class="panel metric-card"><strong>Pedidos</strong><div class="price">${window.VAPTUtils.formatNumber(adminMetrics.orders)}</div></article>
      <article class="panel metric-card"><strong>Entregas ativas</strong><div class="price">${adminMetrics.deliveries}</div></article>
    `;
  }

  if (ordersRoot) {
    ordersRoot.innerHTML = orders
      .map(
        (order) => `
          <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.store}</td>
            <td>${order.deliveryStatus}</td>
            <td>${window.VAPTUtils.formatCurrency(order.total)}</td>
          </tr>
        `
      )
      .join("");
  }

  if (logsRoot) {
    logsRoot.innerHTML = `
      <tr><td>10:31</td><td>admin</td><td>Aprovou nova loja</td><td>Store Prime House habilitada</td></tr>
      <tr><td>10:18</td><td>sistema</td><td>Status de pedido</td><td>PED-24031 alterado para em separacao</td></tr>
      <tr><td>09:54</td><td>lojista</td><td>Atualizou produto</td><td>Fone Orbit recebeu novo estoque</td></tr>
    `;
  }
});
