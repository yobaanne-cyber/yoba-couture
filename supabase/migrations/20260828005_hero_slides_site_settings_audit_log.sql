create table public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text,
  subtitle text,
  link_url text,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.hero_slides enable row level security;

create policy "hero_slides_public_read" on public.hero_slides for select using (is_active or public.is_admin_or_owner());
create policy "hero_slides_staff_write" on public.hero_slides for all using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create trigger trg_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

-- Clés critiques réservées à l'owner (§10.3 : numéros WhatsApp, nom du site)
create or replace function public.is_critical_site_setting(setting_key text)
returns boolean
language sql
immutable
set search_path = public
as $$
  select setting_key in ('site_name', 'whatsapp_number', 'whatsapp_secondary_numbers');
$$;

create or replace function public.enforce_site_settings_permissions()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if public.is_critical_site_setting(new.key) then
    if not public.is_owner() then
      raise exception 'Cette clé de réglage est réservée à l''owner : %', new.key;
    end if;
  elsif not public.is_admin_or_owner() then
    raise exception 'Réservé aux admins/owner';
  end if;

  new.updated_by := auth.uid();
  return new;
end;
$$;

create trigger trg_enforce_site_settings_permissions
before insert or update on public.site_settings
for each row execute function public.enforce_site_settings_permissions();

revoke execute on function public.enforce_site_settings_permissions() from public, anon, authenticated;
revoke execute on function public.is_critical_site_setting(text) from public, anon, authenticated;

-- Lecture publique (le site affiche ces réglages), écriture protégée par le trigger ci-dessus.
create policy "site_settings_public_read" on public.site_settings for select using (true);
create policy "site_settings_write" on public.site_settings for insert with check (public.is_admin_or_owner());
create policy "site_settings_update" on public.site_settings for update using (public.is_admin_or_owner()) with check (public.is_admin_or_owner());

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id uuid,
  payload jsonb,
  created_at timestamptz not null default now()
);

create index audit_log_entity_idx on public.audit_log (entity, entity_id);

alter table public.audit_log enable row level security;

create policy "audit_log_owner_read" on public.audit_log for select using (public.is_owner());
create policy "audit_log_staff_insert" on public.audit_log for insert with check (public.is_admin_or_owner());
