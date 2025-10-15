## Supabase schema plan

This app currently supports: auth (owner/client), dashboard, schedule with project milestones, documents, and daily reports. Below is a lean, normalized schema for Supabase Postgres that covers current UI and near-term needs.

### Conventions
- `id`: uuid default gen_random_uuid() unless noted
- `created_at`/`updated_at`: timestamptz with defaults and trigger to update on write
- Foreign keys use `on delete cascade` where sensible
- Supabase Auth provides `auth.users`; we keep profile/role in `public.profiles`

### 1) profiles
- id: uuid primary key references auth.users(id) on delete cascade
- email: text unique not null
- first_name: text
- last_name: text
- role: text not null check (role in ('owner','client','admin')) default 'client'
- created_at: timestamptz default now()
- updated_at: timestamptz default now()

Purpose: user-facing fields used in Navbar and access control.

### 2) projects
- id: uuid pk
- name: text not null
- code: text unique
- description: text
- status: text check (status in ('planning','active','on_hold','completed')) default 'active'
- start_date: date
- end_date: date
- created_by: uuid references profiles(id)
- created_at: timestamptz default now()
- updated_at: timestamptz default now()

Purpose: Root entity for dashboard pages.

### 3) project_members
- id: uuid pk
- project_id: uuid references projects(id) on delete cascade
- profile_id: uuid references profiles(id) on delete cascade
- role: text check (role in ('owner','client','pm','viewer')) default 'viewer'
- created_at: timestamptz default now()

Purpose: multi-tenant access; which users can see a project.

### 4) milestones
- id: uuid pk
- project_id: uuid references projects(id) on delete cascade
- category: text not null  -- e.g. 'Foundation', 'Structure'
- title: text not null
- description: text
- status: text not null check (status in ('Completed','On Track','At Risk')) default 'On Track'
- status_color: text  -- hex or tailwind key if you want to store ui hint
- target_date: date
- completed_date: date
- day_label: text  -- e.g. 'Day 39'
- is_completed: boolean default false
- sort_index: int  -- for ordering along the timeline
- created_at: timestamptz default now()
- updated_at: timestamptz default now()

Purpose: backs the Schedule -> Project Milestone Timeline (click to open detail card).

### 5) documents
- id: uuid pk
- project_id: uuid references projects(id) on delete cascade
- title: text not null
- category: text  -- e.g. 'RFI','Submittal','Spec','Drawing'
- description: text
- file_url: text not null  -- Supabase Storage path
- version: int default 1
- status: text check (status in ('draft','review','approved','archived')) default 'draft'
- uploaded_by: uuid references profiles(id)
- uploaded_at: timestamptz default now()

Purpose: backs Documents list, stats, filters.

### 6) document_tags
- id: uuid pk
- document_id: uuid references documents(id) on delete cascade
- tag: text not null

Purpose: simple search/filter tags.

### 7) daily_reports
- id: uuid pk
- project_id: uuid references projects(id) on delete cascade
- report_date: date not null
- weather: jsonb  -- optional {temp, conditions}
- summary: text
- created_by: uuid references profiles(id)
- created_at: timestamptz default now()

Purpose: backs Daily Reports and Key Metrics cards.

### 8) issues
- id: uuid pk
- project_id: uuid references projects(id) on delete cascade
- title: text not null
- description: text
- severity: text check (severity in ('low','medium','high')) default 'medium'
- status: text check (status in ('open','in_progress','resolved','closed')) default 'open'
- due_date: date
- created_by: uuid references profiles(id)
- created_at: timestamptz default now()
- updated_at: timestamptz default now()

Purpose: backs the Issues/At Risk items reflected in timeline and dashboard.

### 9) metrics_snapshots (optional but useful)
- id: uuid pk
- project_id: uuid references projects(id) on delete cascade
- snapshot_date: date not null
- data: jsonb not null  -- shape for budget, progress, etc.
- created_at: timestamptz default now()

Purpose: render BudgetSnapshot, ProgressTracking, KeyMetrics historically.

---

## Relationships overview
- profiles 1—* project_members *—1 projects
- projects 1—* milestones
- projects 1—* documents 1—* document_tags
- projects 1—* daily_reports
- projects 1—* issues
- projects 1—* metrics_snapshots

## Row Level Security (RLS) outline
Enable RLS on all tables. Example policies:
- profiles: user can select/update own row where id = auth.uid()
- projects: members (in project_members) can select; owners/admins can insert/update
- project_members: members can select rows for their project; only owner/admin can modify
- milestones/documents/reports/issues/metrics_snapshots: select where project_id in (projects user is a member of); insert/update for owner/pm

## Storage buckets
- documents: public=false; policy allows read to project members; write to owner/pm

## Minimal seed
- one `projects` row
- several `milestones` reflecting current UI sample data
- a few `documents` with tags
- a `profiles` owner user for demo

This schema keeps the app functional now and is easy to extend (e.g., add approvals, assignments, comments, or document versions table) without breaking current UI.


