document.addEventListener("DOMContentLoaded", () => {
  const deliveryRoot = document.querySelector("[data-courier-deliveries]");

  if (!deliveryRoot) {
    return;
  }

  deliveryRoot.innerHTML = window.VAPT_DATA.deliveries
    .map(
      (delivery) => `
        <article class="panel delivery-card">
          <div class="split-content">
            <strong>${delivery.id}</strong>
            <span class="status ${delivery.status === "Em rota" ? "info" : "warning"}">${delivery.status}</span>
          </div>
          <div class="delivery-meta">
            <span>Pedido ${delivery.orderId}</span>
            <span>${delivery.customer}</span>
          </div>
          <div>${delivery.address}</div>
          <div class="meta-text">${delivery.notes}</div>
          <div class="action-row">
            <button class="secondary-button" type="button">Marcar em rota</button>
            <button class="primary-button" type="button">Confirmar entrega</button>
            <button class="ghost-button" type="button">Registrar falha</button>
          </div>
        </article>
      `
    )
    .join("");
});
