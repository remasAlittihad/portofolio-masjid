-- Data pendaftaran anggota dari formulir WhatsApp
create table if not exists public.members (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  age        integer not null check (age > 0),
  phone      text not null,
  motivation text not null,
  created_at timestamptz not null default now()
);

alter table public.members enable row level security;

drop policy if exists "members public insert" on public.members;
create policy "members public insert" on public.members
  for insert to anon, authenticated
  with check (true);

comment on table public.members is 'Data pendaftaran anggota IRMA dari formulir WhatsApp';
