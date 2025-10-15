-- Enable pg crypto for uuid if needed
create extension if not exists pgcrypto;

-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  first_name text,
  last_name text,
  role text not null check (role in ('owner','client','admin')) default 'client',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;

-- projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique,
  description text,
  status text check (status in ('planning','active','on_hold','completed')) default 'active',
  start_date date,
  end_date date,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.projects enable row level security;

-- project_members
create table if not exists public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  role text check (role in ('owner','client','pm','viewer')) default 'viewer',
  created_at timestamptz default now()
);
alter table public.project_members enable row level security;

-- milestones
create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  category text not null,
  title text not null,
  description text,
  status text not null check (status in ('Completed','On Track','At Risk')) default 'On Track',
  status_color text,
  target_date date,
  completed_date date,
  day_label text,
  is_completed boolean default false,
  sort_index int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.milestones enable row level security;

-- documents
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  category text,
  description text,
  file_url text not null,
  version int default 1,
  status text check (status in ('draft','review','approved','archived')) default 'draft',
  uploaded_by uuid references public.profiles(id),
  uploaded_at timestamptz default now()
);
alter table public.documents enable row level security;

-- document_tags
create table if not exists public.document_tags (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents(id) on delete cascade,
  tag text not null
);
alter table public.document_tags enable row level security;

-- daily_reports
create table if not exists public.daily_reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  report_date date not null,
  weather jsonb,
  summary text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);
alter table public.daily_reports enable row level security;

-- issues
create table if not exists public.issues (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  description text,
  severity text check (severity in ('low','medium','high')) default 'medium',
  status text check (status in ('open','in_progress','resolved','closed')) default 'open',
  due_date date,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.issues enable row level security;

-- metrics_snapshots
create table if not exists public.metrics_snapshots (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  snapshot_date date not null,
  data jsonb not null,
  created_at timestamptz default now()
);
alter table public.metrics_snapshots enable row level security;

-- Basic RLS examples (adjust as needed)
create policy if not exists "profiles self" on public.profiles
  for select using (id = auth.uid());

create policy if not exists "projects readable to members" on public.projects
  for select using (exists (
    select 1 from public.project_members m
    where m.project_id = projects.id and m.profile_id = auth.uid()
  ));

create policy if not exists "project_members readable to self" on public.project_members
  for select using (profile_id = auth.uid());

create policy if not exists "milestones readable to members" on public.milestones
  for select using (exists (
    select 1 from public.project_members m
    where m.project_id = milestones.project_id and m.profile_id = auth.uid()
  ));


