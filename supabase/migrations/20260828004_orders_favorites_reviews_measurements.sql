create type public.order_status as enum (
  'nouvelle', 'contactee', 'mesures_recues', 'acompte_verse',
  'en_confection', 'prete', 'livree', 'annulee'
);

create table public.order_counters (
  year integer primary key,
  last_number integer not null default 0
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique,
  product_id uuid not null references public.products(id) on delete restrict,
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  fabric text,
  color text,
  quantity integer not null default 1 check (quantity > 0),
  size_type text,
  note text,
  quoted_price numeric(12,2),
  final_price numeric(12,2),
  status public.order_status not null default 'nouvelle',
  internal_notes text,
  whatsapp_sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index orders_user_idx on public.orders (user_id);
create index orders_status_idx on public.orders (status);
create index orders_product_idx on public.orders (product_id);

create or replace function public.generate_order_number()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  current_year integer := extract(year from now());
  next_number integer;
begin
  if new.order_number is not null then
    return new;
  end if;

  insert into public.order_counters (year, last_number)
  values (current_year, 1)
  on conflict (year) do update set last_number = public.order_counters.last_number + 1
  returning last_number into next_number;

  new.order_number := 'CMD-' || current_year || '-' || lpad(next_number::text, 4, '0');
  return new;
end;
$$;

create trigger trg_generate_order_number
before insert on public.orders
for each row execute function public.generate_order_number();

revoke execute on function public.generate_order_number() from public, anon, authenticated;

alter table public.orders enable row level security;
alter table public.order_counters enable row level security;

-- Insertion publique autorisée (commande sans compte), lecture réservée
-- au propriétaire de la commande ou aux admins (§10.3).
create policy "orders_public_insert" on public.orders for insert with check (true);
create policy "orders_owner_or_staff_read" on public.orders for select using (
  (user_id is not null and user_id = auth.uid()) or public.is_admin_or_owner()
);
create policy "orders_staff_update" on public.orders for update using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());
create policy "order_counters_staff_only" on public.order_counters for all using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table public.favorites enable row level security;

create policy "favorites_owner_only" on public.favorites for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  author_name text not null,
  author_phone text,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  is_verified boolean not null default false,
  is_approved boolean not null default false,
  admin_reply text,
  created_at timestamptz not null default now()
);

create index reviews_product_idx on public.reviews (product_id);
create index reviews_approved_idx on public.reviews (is_approved);

alter table public.reviews enable row level security;

create policy "reviews_public_read_approved" on public.reviews for select using (is_approved or public.is_admin_or_owner());
create policy "reviews_public_insert" on public.reviews for insert with check (is_approved = false and admin_reply is null);
create policy "reviews_staff_update" on public.reviews for update using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());
create policy "reviews_staff_delete" on public.reviews for delete using (public.is_admin_or_owner());

create table public.measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null,
  values jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create trigger trg_measurements_updated_at
before update on public.measurements
for each row execute function public.set_updated_at();

alter table public.measurements enable row level security;

create policy "measurements_owner_only" on public.measurements for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
