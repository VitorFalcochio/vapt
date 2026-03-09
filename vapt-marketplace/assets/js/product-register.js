document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-product-register-form]");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.querySelector("[name='product_name']")?.value.trim();
    const price = form.querySelector("[name='price']")?.value.trim();
    const stock = form.querySelector("[name='stock']")?.value.trim();

    if (!name || !price || !stock) {
      window.showToast("Cadastro incompleto", "Preencha nome, preco e estoque para continuar.");
      return;
    }

    window.showToast("Produto preparado", "Cadastro validado visualmente e pronto para integracao com Supabase.");
    form.reset();
  });
});
