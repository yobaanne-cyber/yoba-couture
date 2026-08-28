create type public.price_type as enum ('fixed', 'from', 'negotiable');
create type public.product_status as enum ('draft', 'published', 'archived');
create type public.availability_status as enum ('sur_commande', 'piece_disponible', 'sur_commande_uniquement', 'epuise');
create type public.gender_target as enum ('homme', 'femme', 'enfant', 'mixte');

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  code text not null unique check (code ~ '^[A-Z0-9]{2,6}$'),
  description text,
  banner_url text,
  position integer not null default 0,
  is_visible boolean not null default true,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now()
);

create table public.modes (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  slug text not null,
  position integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  unique (category_id, slug)
);

create table public.fabrics (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean not null default true
);

create table public.colors (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  hex text not null,
  is_active boolean not null default true
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  reference text unique,
  category_id uuid not null references public.categories(id) on delete restrict,
  description text,
  price numeric(12,2),
  price_type public.price_type not null default 'negotiable',
  currency text not null default 'XOF',
  availability public.availability_status not null default 'sur_commande',
  production_days text,
  gender public.gender_target not null default 'mixte',
  is_featured boolean not null default false,
  status public.product_status not null default 'draft',
  published_at timestamptz,
  view_count integer not null default 0,
  seo_title text,
  seo_description text,
  og_image_url text,
  video_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_idx on public.products (category_id);
create index products_status_idx on public.products (status);
create index products_featured_idx on public.products (is_featured) where is_featured;

create trigger trg_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create table public.product_modes (
  product_id uuid not null references public.products(id) on delete cascade,
  mode_id uuid not null references public.modes(id) on delete cascade,
  primary key (product_id, mode_id)
);

create table public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url_full text not null,
  url_thumb text not null,
  position integer not null default 0,
  alt_text text,
  created_at timestamptz not null default now()
);

create index product_media_product_idx on public.product_media (product_id);

-- Maximum 6 photos par modèle (§6.1, §10.6) — garde-fou serveur en plus du contrôle applicatif.
create or replace function public.enforce_product_media_limit()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if (select count(*) from public.product_media where product_id = new.product_id) >= 6 then
    raise exception 'Maximum 6 photos par modèle';
  end if;
  return new;
end;
$$;

create trigger trg_enforce_product_media_limit
before insert on public.product_media
for each row execute function public.enforce_product_media_limit();

revoke execute on function public.enforce_product_media_limit() from public, anon, authenticated;

create table public.product_fabrics (
  product_id uuid not null references public.products(id) on delete cascade,
  fabric_id uuid not null references public.fabrics(id) on delete cascade,
  primary key (product_id, fabric_id)
);

create table public.product_colors (
  product_id uuid not null references public.products(id) on delete cascade,
  color_id uuid not null references public.colors(id) on delete cascade,
  primary key (product_id, color_id)
);

-- Génération automatique de la référence YB-XXX-0000 (§6.2, §9.4)
create table public.category_counters (
  category_id uuid primary key references public.categories(id) on delete cascade,
  last_number integer not null default 0
);

create or replace function public.generate_product_reference()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  cat_code text;
  next_number integer;
begin
  if new.reference is not null then
    return new;
  end if;

  select code into cat_code from public.categories where id = new.category_id;
  if cat_code is null then
    raise exception 'Catégorie introuvable ou sans code';
  end if;

  insert into public.category_counters (category_id, last_number)
  values (new.category_id, 1)
  on conflict (category_id) do update set last_number = public.category_counters.last_number + 1
  returning last_number into next_number;

  new.reference := 'YB-' || cat_code || '-' || lpad(next_number::text, 4, '0');
  return new;
end;
$$;

create trigger trg_generate_product_reference
before insert on public.products
for each row execute function public.generate_product_reference();

revoke execute on function public.generate_product_reference() from public, anon, authenticated;

alter table public.categories enable row level security;
alter table public.modes enable row level security;
alter table public.fabrics enable row level security;
alter table public.colors enable row level security;
alter table public.products enable row level security;
alter table public.product_modes enable row level security;
alter table public.product_media enable row level security;
alter table public.product_fabrics enable row level security;
alter table public.product_colors enable row level security;
alter table public.category_counters enable row level security;

create policy "categories_public_read" on public.categories for select using (is_visible or public.is_admin_or_owner());
create policy "categories_staff_write" on public.categories for all using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());

create policy "modes_public_read" on public.modes for select using (is_visible or public.is_admin_or_owner());
create policy "modes_staff_write" on public.modes for all using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());

create policy "fabrics_public_read" on public.fabrics for select using (true);
create policy "fabrics_staff_write" on public.fabrics for all using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());

create policy "colors_public_read" on public.colors for select using (true);
create policy "colors_staff_write" on public.colors for all using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());

create policy "products_public_read_published" on public.products for select using (status = 'published' or public.is_admin_or_owner());
create policy "products_staff_write" on public.products for all using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());

create policy "product_modes_public_read" on public.product_modes for select using (
  exists (select 1 from public.products p where p.id = product_id and (p.status = 'published' or public.is_admin_or_owner()))
);
create policy "product_modes_staff_write" on public.product_modes for all using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());

create policy "product_media_public_read" on public.product_media for select using (
  exists (select 1 from public.products p where p.id = product_id and (p.status = 'published' or public.is_admin_or_owner()))
);
create policy "product_media_staff_write" on public.product_media for all using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());

create policy "product_fabrics_public_read" on public.product_fabrics for select using (
  exists (select 1 from public.products p where p.id = product_id and (p.status = 'published' or public.is_admin_or_owner()))
);
create policy "product_fabrics_staff_write" on public.product_fabrics for all using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());

create policy "product_colors_public_read" on public.product_colors for select using (
  exists (select 1 from public.products p where p.id = product_id and (p.status = 'published' or public.is_admin_or_owner()))
);
create policy "product_colors_staff_write" on public.product_colors for all using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());

create policy "category_counters_staff_only" on public.category_counters for all using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());
