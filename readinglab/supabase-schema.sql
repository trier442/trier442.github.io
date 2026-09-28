-- Sophie Reading Lab - Supabase schema (phase 2)
-- Run in Supabase SQL editor after creating a project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null default 'student' check (role in ('student','teacher','admin')),
  grade text,
  created_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.class_members (
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (class_id, student_id)
);

create table if not exists public.lessons (
  id text primary key,
  title text not null,
  category text,
  level text,
  difficulty text,
  payload jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  lesson_id text not null references public.lessons(id),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  due_date date,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  draft text not null default '',
  status text not null default 'draft' check (status in ('draft','submitted','reviewed')),
  submitted_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (assignment_id, student_id)
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references public.submissions(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  thesis_score int check (thesis_score between 1 and 5),
  evidence_score int check (evidence_score between 1 and 5),
  logic_score int check (logic_score between 1 and 5),
  style_score int check (style_score between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  completed_steps text[] not null default '{}',
  draft text not null default '',
  updated_at timestamptz not null default now(),
  primary key (student_id, lesson_id)
);

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_members enable row level security;
alter table public.lessons enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;
alter table public.feedback enable row level security;
alter table public.lesson_progress enable row level security;

-- Profiles: users can read/update their own profile.
create policy "profiles_select_self" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_self" on public.profiles for update using (auth.uid() = id);

-- Published lessons are readable by signed-in users.
create policy "lessons_read_published" on public.lessons for select to authenticated using (is_published = true);

-- Teachers control their own classes.
create policy "classes_teacher_all" on public.classes for all
using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());

-- Members can see their membership; teachers can see memberships for their classes.
create policy "class_members_read" on public.class_members for select using (
  student_id = auth.uid()
  or exists (select 1 from public.classes c where c.id = class_id and c.teacher_id = auth.uid())
);
create policy "class_members_teacher_write" on public.class_members for all using (
  exists (select 1 from public.classes c where c.id = class_id and c.teacher_id = auth.uid())
) with check (
  exists (select 1 from public.classes c where c.id = class_id and c.teacher_id = auth.uid())
);

-- Assignments: teachers manage; enrolled students read.
create policy "assignments_read" on public.assignments for select using (
  teacher_id = auth.uid()
  or exists (select 1 from public.class_members cm where cm.class_id = assignments.class_id and cm.student_id = auth.uid())
);
create policy "assignments_teacher_write" on public.assignments for all
using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());

-- Submissions: student owns own answer; class teacher can read/update review state.
create policy "submissions_student_read_write" on public.submissions for all
using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "submissions_teacher_read" on public.submissions for select using (
  exists (
    select 1 from public.assignments a
    join public.classes c on c.id = a.class_id
    where a.id = submissions.assignment_id and c.teacher_id = auth.uid()
  )
);
create policy "submissions_teacher_update" on public.submissions for update using (
  exists (
    select 1 from public.assignments a
    join public.classes c on c.id = a.class_id
    where a.id = submissions.assignment_id and c.teacher_id = auth.uid()
  )
);

-- Feedback: teachers write for their class submissions; student reads own feedback.
create policy "feedback_read" on public.feedback for select using (
  teacher_id = auth.uid()
  or exists (select 1 from public.submissions s where s.id = feedback.submission_id and s.student_id = auth.uid())
);
create policy "feedback_teacher_write" on public.feedback for all
using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());

-- Individual learning progress.
create policy "progress_student_all" on public.lesson_progress for all
using (student_id = auth.uid()) with check (student_id = auth.uid());

-- Create profile automatically for new auth users.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)), coalesce(new.raw_user_meta_data->>'role','student'));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
