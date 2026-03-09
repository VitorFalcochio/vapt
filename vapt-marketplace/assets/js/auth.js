document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-auth-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const mode = form.getAttribute("data-auth-form");
      const email = form.querySelector("input[type='email']")?.value.trim();
      const password = form.querySelector("input[type='password']")?.value.trim();

      if (!email || !password) {
        window.showToast("Campos obrigatorios", "Preencha email e senha para continuar.");
        return;
      }

      if (mode === "register") {
        const name = form.querySelector("input[name='name']")?.value.trim();
        const cpf = form.querySelector("input[name='cpf']")?.value.trim();

        if (!name || !cpf) {
          window.showToast("Cadastro incompleto", "Informe nome completo e CPF do cliente.");
          return;
        }
      }

      window.showToast(
        "Fluxo de autenticacao",
        `${mode === "register" ? "Cadastro de cliente" : "Login"} revisado e pronto para Supabase Auth.`
      );
    });
  });
});
