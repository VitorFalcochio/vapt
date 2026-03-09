# VAPT Marketplace

Base inicial do marketplace VAPT em HTML, CSS, JavaScript puro e Supabase.

## O que foi reorganizado nesta etapa

- redesign completo da area publica
- nova base visual modular com `global.css`, `layout.css` e `components.css`
- paginas publicas revisadas: home, catalogo, produto, carrinho, checkout, conta e pedidos
- base inicial para dashboards de lojista, admin e entregador
- scripts separados por responsabilidade com dados mockados para navegacao local

## Estrutura atual

```text
vapt-marketplace/
  assets/
    css/
    js/
  pages/
  schema.sql
  README.md
```

## Como rodar

1. Sirva a pasta `vapt-marketplace` com um servidor estatico.
2. Abra `pages/index.html`.

Exemplo:

```bash
npx serve .
```

## Supabase

1. Crie um projeto no Supabase.
2. Rode `schema.sql` no SQL Editor.
3. Configure `assets/js/supabase.js` com a `Project URL` e a `anon key`.

```js
const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_PUBLIC_ANON_KEY";
```

## Seguranca

- use apenas `anon key` no front-end
- nunca exponha `service_role`
- a etapa atual ainda usa dados mockados para parte da navegacao
- a proxima fase vai conectar schema, RLS, logs, CEP e pagamentos
