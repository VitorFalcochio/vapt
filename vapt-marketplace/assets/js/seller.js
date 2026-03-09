document.addEventListener("DOMContentLoaded", () => {
  const { sellerMetrics, products, orders } = window.VAPT_DATA;
  const metricsRoot = document.querySelector("[data-seller-metrics]");
  const productsRoot = document.querySelector("[data-seller-products]");
  const ordersRoot = document.querySelector("[data-seller-orders]");

  if (metricsRoot) {
    metricsRoot.innerHTML = `
      <article class="panel metric-card"><strong>Produtos ativos</strong><div class="price">${sellerMetrics.activeProducts}</div></article>
      <article class="panel metric-card"><strong>Pedidos recebidos</strong><div class="price">${sellerMetrics.orders}</div></article>
      <article class="panel metric-card"><strong>Faturamento estimado</strong><div class="price">${window.VAPTUtils.formatCurrency(sellerMetrics.revenue)}</div></article>
      <article class="panel metric-card"><strong>Notas pendentes</strong><div class="price">${sellerMetrics.pendingInvoices}</div></article>
    `;
  }

  if (productsRoot) {
    productsRoot.innerHTML = products
      .slice(0, 4)
      .map(
        (product) => `
          <tr>
            <td>${product.title}</td>
            <td><span class="status success">Ativo</span></td>
            <td>${window.VAPTUtils.formatCurrency(product.price)}</td>
            <td>${product.stock}</td>
          </tr>
        `
      )
      .join("");
  }

  if (ordersRoot) {
    ordersRoot.innerHTML = orders
      .map(
        (order) => `
          <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.deliveryStatus}</td>
            <td>${window.VAPTUtils.formatCurrency(order.total)}</td>
          </tr>
        `
      )
      .join("");
  }
});
