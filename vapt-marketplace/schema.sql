create extension if not exists "pgcrypto";

set check_function_bodies = off;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'lojista', 'comprador', 'entregador');
  end if;

  if not exists (select 1 from pg_type where typname = 'store_status') then
    create type public.store_status as enum ('pending', 'approved', 'blocked');
  end if;

  if not exists (select 1 from pg_type where typname = 'product_status') then
    create type public.product_status as enum ('draft', 'active', 'archived');
  end if;

  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type public.order_status as enum (
      'pending',
      'confirmed',
      'processing',
      'ready_for_pickup',
      'out_for_delivery',
      'delivered',
      'cancelled'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_method_type') then
    create type public.payment_method_type as enum ('cash_on_delivery', 'pix', 'credit_card');
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_status_type') then
    create type public.payment_status_type as enum ('pending', 'paid', 'failed', 'on_delivery_payment', 'refunded');
  end if;

  if not exists (select 1 from pg_type where typname = 'delivery_status') then
    create type public.delivery_status as enum ('pending', 'assigned', 'in_route', 'delivered', 'failed');
  end if;

  if not exists (select 1 from pg_type where typname = 'invoice_status') then
    create type public.invoice_status as enum ('pending', 'issued', 'cancelled');
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.current_user_role()
returns public.app_role
language sql
stable
as $$
  select role
  from public.profiles
  where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(public.current_user_role() = 'admin', false)
$$;

create or replace function public.owns_store(target_store_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.stores
    where id = target_store_id
      and owner_id = auth.uid()
  )
$$;

create or replace function public.can_access_order(target_order_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.orders o
    where o.id = target_order_id
      and (
        o.customer_id = auth.uid()
        or public.is_admin()
        or exists (
          select 1
          from public.order_items oi
          join public.stores s on s.id = oi.store_id
          where oi.order_id = o.id
            and s.owner_id = auth.uid()
        )
        or exists (
          select 1
          from public.deliveries d
          where d.order_id = o.id
            and d.courier_id = auth.uid()
        )
      )
  )
$$;

create or replace function public.can_manage_order(target_order_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.orders o
    where o.id = target_order_id
      and (
        public.is_admin()
        or exists (
          select 1
          from public.order_items oi
          join public.stores s on s.id = oi.store_id
          where oi.order_id = o.id
            and s.owner_id = auth.uid()
        )
        or exists (
          select 1
          from public.deliveries d
          where d.order_id = o.id
            and d.courier_id = auth.uid()
        )
      )
  )
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null unique,
  role public.app_role not null default 'comprador',
  cpf text unique,
  phone text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  status public.store_status not null default 'pending',
  approved_at timestamptz,
  approved_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete restrict,
  title text not null,
  slug text not null unique,
  sku text unique,
  short_description text,
  description text not null,
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2) check (compare_at_price is null or compare_at_price >= price),
  stock integer not null default 0 check (stock >= 0),
  status public.product_status not null default 'draft',
  is_featured boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  image_url text not null,
  is_main boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  label text not null default 'Principal',
  recipient_name text,
  zip_code text not null,
  street text not null,
  number text not null,
  complement text,
  neighborhood text not null,
  city text not null,
  state text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id) on delete restrict,
  address_id uuid references public.addresses (id) on delete set null,
  subtotal_amount numeric(12,2) not null default 0 check (subtotal_amount >= 0),
  shipping_amount numeric(12,2) not null default 0 check (shipping_amount >= 0),
  total_amount numeric(12,2) not null default 0 check (total_amount >= 0),
  status public.order_status not null default 'pending',
  payment_method public.payment_method_type not null default 'pix',
  payment_status public.payment_status_type not null default 'pending',
  notes text,
  placed_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  store_id uuid not null references public.stores (id) on delete restrict,
  product_id uuid not null references public.products (id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  total_price numeric(12,2) not null check (total_price >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  unique (order_id, product_id)
);

create table if not exists public.deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  store_id uuid not null references public.stores (id) on delete cascade,
  courier_id uuid references public.profiles (id) on delete set null,
  status public.delivery_status not null default 'pending',
  delivery_address text,
  recipient_name text,
  recipient_phone text,
  customer_notes text,
  courier_notes text,
  assigned_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (order_id, store_id)
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  store_id uuid not null references public.stores (id) on delete cascade,
  invoice_number text not null,
  file_url text,
  status public.invoice_status not null default 'pending',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (store_id, invoice_number)
);

create table if not exists public.payment_records (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  payment_method public.payment_method_type not null,
  status public.payment_status_type not null default 'pending',
  amount numeric(12,2) not null check (amount >= 0),
  gateway_reference text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  previous_status public.order_status,
  new_status public.order_status not null,
  changed_by uuid references public.profiles (id) on delete set null,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.system_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  role public.app_role,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  target_table text,
  target_id uuid,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_profiles_role on public.profiles (role);
create index if not exists idx_profiles_active on public.profiles (is_active);
create index if not exists idx_stores_owner on public.stores (owner_id);
create index if not exists idx_stores_status on public.stores (status);
create index if not exists idx_products_store on public.products (store_id);
create index if not exists idx_products_category on public.products (category_id);
create index if not exists idx_products_status on public.products (status);
create index if not exists idx_product_images_product on public.product_images (product_id);
create index if not exists idx_addresses_user on public.addresses (user_id);
create index if not exists idx_cart_items_user on public.cart_items (user_id);
create index if not exists idx_orders_customer on public.orders (customer_id);
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_order_items_order on public.order_items (order_id);
create index if not exists idx_order_items_store on public.order_items (store_id);
create index if not exists idx_deliveries_order on public.deliveries (order_id);
create index if not exists idx_deliveries_courier on public.deliveries (courier_id);
create index if not exists idx_invoices_order on public.invoices (order_id);
create index if not exists idx_payment_records_order on public.payment_records (order_id);
create index if not exists idx_order_status_history_order on public.order_status_history (order_id);
create index if not exists idx_system_logs_user on public.system_logs (user_id);
create index if not exists idx_system_logs_action on public.system_logs (action);
create unique index if not exists idx_product_images_single_main on public.product_images (product_id) where is_main;
create unique index if not exists idx_addresses_single_default on public.addresses (user_id) where is_default;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    'comprador',
    nullif(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do update
  set
    name = excluded.name,
    email = excluded.email,
    phone = coalesce(excluded.phone, public.profiles.phone),
    updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
drop trigger if exists trg_stores_updated_at on public.stores;
create trigger trg_stores_updated_at before update on public.stores for each row execute procedure public.set_updated_at();
drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at before update on public.products for each row execute procedure public.set_updated_at();
drop trigger if exists trg_addresses_updated_at on public.addresses;
create trigger trg_addresses_updated_at before update on public.addresses for each row execute procedure public.set_updated_at();
drop trigger if exists trg_cart_items_updated_at on public.cart_items;
create trigger trg_cart_items_updated_at before update on public.cart_items for each row execute procedure public.set_updated_at();
drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at before update on public.orders for each row execute procedure public.set_updated_at();
drop trigger if exists trg_deliveries_updated_at on public.deliveries;
create trigger trg_deliveries_updated_at before update on public.deliveries for each row execute procedure public.set_updated_at();
drop trigger if exists trg_invoices_updated_at on public.invoices;
create trigger trg_invoices_updated_at before update on public.invoices for each row execute procedure public.set_updated_at();
drop trigger if exists trg_payment_records_updated_at on public.payment_records;
create trigger trg_payment_records_updated_at before update on public.payment_records for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.addresses enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.deliveries enable row level security;
alter table public.invoices enable row level security;
alter table public.payment_records enable row level security;
alter table public.order_status_history enable row level security;
alter table public.system_logs enable row level security;

drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin"
on public.profiles
for select
using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
on public.profiles
for insert
with check (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_self_or_admin" on public.profiles;
create policy "profiles_update_self_or_admin"
on public.profiles
for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

drop policy if exists "stores_select_public_or_owner_or_admin" on public.stores;
create policy "stores_select_public_or_owner_or_admin"
on public.stores
for select
using (status = 'approved' or owner_id = auth.uid() or public.is_admin());

drop policy if exists "stores_insert_owner_or_admin" on public.stores;
create policy "stores_insert_owner_or_admin"
on public.stores
for insert
with check (
  owner_id = auth.uid()
  and (
    public.current_user_role() in ('lojista', 'admin')
    or public.is_admin()
  )
);

drop policy if exists "stores_update_owner_or_admin" on public.stores;
create policy "stores_update_owner_or_admin"
on public.stores
for update
using (owner_id = auth.uid() or public.is_admin())
with check (owner_id = auth.uid() or public.is_admin());

drop policy if exists "stores_delete_owner_or_admin" on public.stores;
create policy "stores_delete_owner_or_admin"
on public.stores
for delete
using (owner_id = auth.uid() or public.is_admin());

drop policy if exists "categories_select_public" on public.categories;
create policy "categories_select_public"
on public.categories
for select
using (true);

drop policy if exists "categories_admin_manage" on public.categories;
create policy "categories_admin_manage"
on public.categories
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "products_select_public_or_owner_or_admin" on public.products;
create policy "products_select_public_or_owner_or_admin"
on public.products
for select
using (
  (
    status = 'active'
    and exists (
      select 1
      from public.stores s
      where s.id = products.store_id
        and s.status = 'approved'
    )
  )
  or public.owns_store(store_id)
  or public.is_admin()
);

drop policy if exists "products_insert_owner_or_admin" on public.products;
create policy "products_insert_owner_or_admin"
on public.products
for insert
with check (public.owns_store(store_id) or public.is_admin());

drop policy if exists "products_update_owner_or_admin" on public.products;
create policy "products_update_owner_or_admin"
on public.products
for update
using (public.owns_store(store_id) or public.is_admin())
with check (public.owns_store(store_id) or public.is_admin());

drop policy if exists "products_delete_owner_or_admin" on public.products;
create policy "products_delete_owner_or_admin"
on public.products
for delete
using (public.owns_store(store_id) or public.is_admin());

drop policy if exists "product_images_select_public" on public.product_images;
create policy "product_images_select_public"
on public.product_images
for select
using (true);

drop policy if exists "product_images_insert_owner_or_admin" on public.product_images;
create policy "product_images_insert_owner_or_admin"
on public.product_images
for insert
with check (
  exists (
    select 1
    from public.products p
    where p.id = product_id
      and (public.owns_store(p.store_id) or public.is_admin())
  )
);

drop policy if exists "product_images_update_owner_or_admin" on public.product_images;
create policy "product_images_update_owner_or_admin"
on public.product_images
for update
using (
  exists (
    select 1
    from public.products p
    where p.id = product_id
      and (public.owns_store(p.store_id) or public.is_admin())
  )
)
with check (
  exists (
    select 1
    from public.products p
    where p.id = product_id
      and (public.owns_store(p.store_id) or public.is_admin())
  )
);

drop policy if exists "product_images_delete_owner_or_admin" on public.product_images;
create policy "product_images_delete_owner_or_admin"
on public.product_images
for delete
using (
  exists (
    select 1
    from public.products p
    where p.id = product_id
      and (public.owns_store(p.store_id) or public.is_admin())
  )
);

drop policy if exists "addresses_select_owner_or_admin" on public.addresses;
create policy "addresses_select_owner_or_admin"
on public.addresses
for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "addresses_insert_owner_or_admin" on public.addresses;
create policy "addresses_insert_owner_or_admin"
on public.addresses
for insert
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "addresses_update_owner_or_admin" on public.addresses;
create policy "addresses_update_owner_or_admin"
on public.addresses
for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "addresses_delete_owner_or_admin" on public.addresses;
create policy "addresses_delete_owner_or_admin"
on public.addresses
for delete
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "cart_items_select_owner_or_admin" on public.cart_items;
create policy "cart_items_select_owner_or_admin"
on public.cart_items
for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "cart_items_insert_owner_or_admin" on public.cart_items;
create policy "cart_items_insert_owner_or_admin"
on public.cart_items
for insert
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "cart_items_update_owner_or_admin" on public.cart_items;
create policy "cart_items_update_owner_or_admin"
on public.cart_items
for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "cart_items_delete_owner_or_admin" on public.cart_items;
create policy "cart_items_delete_owner_or_admin"
on public.cart_items
for delete
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "orders_select_related_users" on public.orders;
create policy "orders_select_related_users"
on public.orders
for select
using (public.can_access_order(id));

drop policy if exists "orders_insert_customer_or_admin" on public.orders;
create policy "orders_insert_customer_or_admin"
on public.orders
for insert
with check (customer_id = auth.uid() or public.is_admin());

drop policy if exists "orders_update_related_users" on public.orders;
create policy "orders_update_related_users"
on public.orders
for update
using (public.can_manage_order(id) or customer_id = auth.uid() or public.is_admin())
with check (public.can_manage_order(id) or customer_id = auth.uid() or public.is_admin());

drop policy if exists "order_items_select_related_users" on public.order_items;
create policy "order_items_select_related_users"
on public.order_items
for select
using (public.can_access_order(order_id));

drop policy if exists "order_items_insert_customer_or_admin" on public.order_items;
create policy "order_items_insert_customer_or_admin"
on public.order_items
for insert
with check (
  public.is_admin()
  or exists (
    select 1
    from public.orders o
    where o.id = order_id
      and o.customer_id = auth.uid()
  )
);

drop policy if exists "deliveries_select_related_users" on public.deliveries;
create policy "deliveries_select_related_users"
on public.deliveries
for select
using (
  public.is_admin()
  or courier_id = auth.uid()
  or public.owns_store(store_id)
  or public.can_access_order(order_id)
);

drop policy if exists "deliveries_insert_owner_or_admin" on public.deliveries;
create policy "deliveries_insert_owner_or_admin"
on public.deliveries
for insert
with check (public.owns_store(store_id) or public.is_admin());

drop policy if exists "deliveries_update_related_users" on public.deliveries;
create policy "deliveries_update_related_users"
on public.deliveries
for update
using (public.is_admin() or public.owns_store(store_id) or courier_id = auth.uid())
with check (public.is_admin() or public.owns_store(store_id) or courier_id = auth.uid());

drop policy if exists "invoices_select_owner_or_admin" on public.invoices;
create policy "invoices_select_owner_or_admin"
on public.invoices
for select
using (public.is_admin() or public.owns_store(store_id));

drop policy if exists "invoices_insert_owner_or_admin" on public.invoices;
create policy "invoices_insert_owner_or_admin"
on public.invoices
for insert
with check (public.is_admin() or public.owns_store(store_id));

drop policy if exists "invoices_update_owner_or_admin" on public.invoices;
create policy "invoices_update_owner_or_admin"
on public.invoices
for update
using (public.is_admin() or public.owns_store(store_id))
with check (public.is_admin() or public.owns_store(store_id));

drop policy if exists "payment_records_select_related_users" on public.payment_records;
create policy "payment_records_select_related_users"
on public.payment_records
for select
using (public.can_access_order(order_id));

drop policy if exists "payment_records_insert_related_users" on public.payment_records;
create policy "payment_records_insert_related_users"
on public.payment_records
for insert
with check (
  public.is_admin()
  or exists (
    select 1
    from public.orders o
    where o.id = order_id
      and o.customer_id = auth.uid()
  )
);

drop policy if exists "payment_records_update_admin_only" on public.payment_records;
create policy "payment_records_update_admin_only"
on public.payment_records
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "order_status_history_select_related_users" on public.order_status_history;
create policy "order_status_history_select_related_users"
on public.order_status_history
for select
using (public.can_access_order(order_id));

drop policy if exists "order_status_history_insert_related_users" on public.order_status_history;
create policy "order_status_history_insert_related_users"
on public.order_status_history
for insert
with check (
  public.can_manage_order(order_id)
  or public.is_admin()
  or exists (
    select 1
    from public.orders o
    where o.id = order_id
      and o.customer_id = auth.uid()
  )
);

drop policy if exists "system_logs_select_admin_only" on public.system_logs;
create policy "system_logs_select_admin_only"
on public.system_logs
for select
using (public.is_admin());

drop policy if exists "system_logs_insert_authenticated" on public.system_logs;
create policy "system_logs_insert_authenticated"
on public.system_logs
for insert
with check (
  auth.role() = 'authenticated'
  and (user_id = auth.uid() or user_id is null)
);

insert into public.categories (id, name, slug)
values
  ('11111111-1111-1111-1111-111111111111', 'Eletronicos', 'eletronicos'),
  ('22222222-2222-2222-2222-222222222222', 'Casa e Decoracao', 'casa-e-decoracao'),
  ('33333333-3333-3333-3333-333333333333', 'Moda', 'moda'),
  ('44444444-4444-4444-4444-444444444444', 'Esporte e Lazer', 'esporte-e-lazer'),
  ('55555555-5555-5555-5555-555555555555', 'Beleza e Cuidado', 'beleza-e-cuidado'),
  ('66666666-6666-6666-6666-666666666666', 'Utilidades', 'utilidades')
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product_images_bucket_public_read" on storage.objects;
create policy "product_images_bucket_public_read"
on storage.objects
for select
using (bucket_id = 'product-images');

drop policy if exists "product_images_bucket_insert_owner_or_admin" on storage.objects;
create policy "product_images_bucket_insert_owner_or_admin"
on storage.objects
for insert
with check (
  bucket_id = 'product-images'
  and auth.role() = 'authenticated'
  and (
    public.is_admin()
    or (storage.foldername(name))[1] = auth.uid()::text
  )
);

drop policy if exists "product_images_bucket_update_owner_or_admin" on storage.objects;
create policy "product_images_bucket_update_owner_or_admin"
on storage.objects
for update
using (
  bucket_id = 'product-images'
  and auth.role() = 'authenticated'
  and (
    public.is_admin()
    or (storage.foldername(name))[1] = auth.uid()::text
  )
)
with check (
  bucket_id = 'product-images'
  and auth.role() = 'authenticated'
  and (
    public.is_admin()
    or (storage.foldername(name))[1] = auth.uid()::text
  )
);

drop policy if exists "product_images_bucket_delete_owner_or_admin" on storage.objects;
create policy "product_images_bucket_delete_owner_or_admin"
on storage.objects
for delete
using (
  bucket_id = 'product-images'
  and auth.role() = 'authenticated'
  and (
    public.is_admin()
    or (storage.foldername(name))[1] = auth.uid()::text
  )
);

-- Seed opcional de loja e catalogo:
-- 1. Crie um usuario lojista no Supabase Auth.
-- 2. Atualize o role desse usuario em profiles para 'lojista'.
-- 3. Substitua LOJISTA_USER_ID abaixo e rode os inserts.
--
-- insert into public.stores (owner_id, name, slug, description, status)
-- values ('LOJISTA_USER_ID', 'VAPT Prime', 'vapt-prime', 'Loja demo do marketplace VAPT.', 'approved');
--
-- insert into public.products (store_id, category_id, title, slug, sku, short_description, description, price, compare_at_price, stock, status)
-- values
--   ((select id from public.stores where slug = 'vapt-prime'), '11111111-1111-1111-1111-111111111111', 'Fone Bluetooth Orbit', 'fone-bluetooth-orbit', 'VAPT-OBT-01', 'Audio premium com bateria longa.', 'Fone sem fio com cancelamento leve, conforto diario e alta conversao na vitrine.', 249.90, 299.90, 18, 'active'),
--   ((select id from public.stores where slug = 'vapt-prime'), '22222222-2222-2222-2222-222222222222', 'Luminaria Halo', 'luminaria-halo', 'VAPT-HALO-02', 'Luz quente para mesa e home office.', 'Luminaria moderna com acabamento comercial e uso diario.', 139.90, 179.90, 25, 'active');
