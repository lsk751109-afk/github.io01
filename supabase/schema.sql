-- Caretaek initial database schema
-- Run this file in Supabase Dashboard > SQL Editor.

create extension if not exists "pgcrypto";

create type public.user_role as enum ('guardian', 'caregiver', 'admin');
create type public.match_status as enum ('requested', 'reviewing', 'matched', 'paid', 'in_service', 'completed', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null,
  name text not null,
  phone text,
  email text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.guardians (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  patient_relation text,
  patient_name text,
  patient_note text
);

create table public.caregivers (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  birth_date date,
  gender text,
  career_years integer not null default 0 check (career_years >= 0),
  certificates text[] not null default '{}',
  service_regions text[] not null default '{}',
  introduction text,
  hourly_rate integer check (hourly_rate is null or hourly_rate >= 0),
  rating numeric(2,1) not null default 0 check (rating between 0 and 5),
  review_count integer not null default 0,
  is_verified boolean not null default false,
  is_available boolean not null default true,
  profile_image_url text
);

create table public.care_requests (
  id uuid primary key default gen_random_uuid(),
  guardian_id uuid not null references public.guardians(user_id) on delete cascade,
  care_type text not null,
  region text not null,
  start_date date not null,
  end_date date,
  is_vip boolean not null default false,
  patient_condition text,
  budget integer,
  status public.match_status not null default 'requested',
  created_at timestamptz not null default now()
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  care_request_id uuid not null references public.care_requests(id) on delete cascade,
  caregiver_id uuid not null references public.caregivers(user_id),
  status public.match_status not null default 'reviewing',
  agreed_amount integer,
  created_at timestamptz not null default now(),
  unique(care_request_id, caregiver_id)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null unique references public.matches(id) on delete cascade,
  guardian_id uuid not null references public.guardians(user_id),
  caregiver_id uuid not null references public.caregivers(user_id),
  rating integer not null check (rating between 1 and 5),
  content text,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  guardian_id uuid not null references public.guardians(user_id),
  amount integer not null check (amount > 0),
  provider text,
  payment_uid text unique,
  status text not null default 'ready',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, role, name, phone, email)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'guardian'),
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'phone',
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.guardians enable row level security;
alter table public.caregivers enable row level security;
alter table public.care_requests enable row level security;
alter table public.matches enable row level security;
alter table public.reviews enable row level security;
alter table public.payments enable row level security;

create policy "profiles read own" on public.profiles for select using (auth.uid() = id);
create policy "profiles update own" on public.profiles for update using (auth.uid() = id);
create policy "guardians own row" on public.guardians for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "caregivers public read" on public.caregivers for select using (true);
create policy "caregivers own write" on public.caregivers for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "guardians manage requests" on public.care_requests for all using (auth.uid() = guardian_id) with check (auth.uid() = guardian_id);
create policy "participants read matches" on public.matches for select using (
  auth.uid() = caregiver_id or exists (
    select 1 from public.care_requests r where r.id = care_request_id and r.guardian_id = auth.uid()
  )
);
create policy "guardians create reviews" on public.reviews for insert with check (auth.uid() = guardian_id);
create policy "reviews public read" on public.reviews for select using (true);
create policy "guardians read payments" on public.payments for select using (auth.uid() = guardian_id);
