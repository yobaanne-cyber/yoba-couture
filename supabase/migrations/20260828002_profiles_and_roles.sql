create type public.user_role as enum ('client', 'admin', 'owner');
create type public.auth_method as enum ('email', 'phone', 'google');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'client',
  full_name text,
  phone text unique,
  phone_verified boolean not null default false,
  email text,
  city text,
  avatar_url text,
  auth_method public.auth_method not null default 'email',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Fonctions SECURITY DEFINER : lisent le rôle sans provoquer de récursion RLS.
-- Laissées exécutables par anon/authenticated : elles ne renvoient que le
-- statut du rôle de l'appelant lui-même, aucune fuite de données.
create or replace function public.current_user_role()
returns public.user_role
language sql
security definer
stable
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin_or_owner()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('admin', 'owner'), false);
$$;

create or replace function public.is_owner()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'owner', false);
$$;

-- Le rôle ne doit jamais être modifiable par l'utilisateur lui-même (§10.3).
-- auth.uid() est NULL uniquement pour un contexte serveur/migration de
-- confiance (service_role, éditeur SQL) : un visiteur anon/authenticated a
-- toujours un auth.uid() non nul, et est de toute façon bloqué en amont par
-- les policies RLS avant même d'atteindre ce trigger.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if tg_op = 'UPDATE' and new.role is distinct from old.role then
    if not public.is_admin_or_owner() then
      raise exception 'Seuls les admins/owner peuvent modifier le rôle';
    end if;
  end if;

  if tg_op = 'INSERT' and new.role <> 'client' and not public.is_admin_or_owner() then
    new.role := 'client';
  end if;

  return new;
end;
$$;

create trigger trg_protect_profile_role
before insert or update on public.profiles
for each row execute function public.protect_profile_role();

-- Auto-création du profil à l'inscription Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger trg_handle_new_user
after insert on auth.users
for each row execute function public.handle_new_user();

create policy "profiles_select_own_or_staff"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin_or_owner());

create policy "profiles_update_own_or_staff"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin_or_owner());

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

revoke execute on function public.protect_profile_role() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
