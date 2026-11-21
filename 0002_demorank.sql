create table if not exists demos (
  id serial primary key,
  user_id text not null,
  slug text not null unique,
  title text not null,
  company text not null,
  pitch text not null,
  category text not null check (category in ('saas', 'ai', 'tech', 'other')),
  video_url text not null unique,
  video_kind text not null check (video_kind in ('youtube', 'vimeo', 'loom', 'file')),
  video_id text not null,
  product_url text not null,
  status text not null default 'live' check (status in ('live', 'withdrawn')),
  clicks integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists demos_user_idx on demos (user_id);
create index if not exists demos_live_created_idx on demos (status, created_at desc);

create table if not exists votes (
  id serial primary key,
  user_id text not null,
  demo_id integer not null references demos (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, demo_id)
);

create index if not exists votes_demo_created_idx on votes (demo_id, created_at);
create index if not exists votes_user_idx on votes (user_id, created_at desc);

create table if not exists bids (
  id serial primary key,
  user_id text not null,
  demo_id integer not null references demos (id) on delete cascade,
  bid_date date not null,
  amount_cents integer not null check (amount_cents >= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (demo_id, bid_date)
);

create index if not exists bids_day_amount_idx on bids (bid_date, amount_cents desc);

create table if not exists payments (
  id serial primary key,
  user_id text not null,
  demo_id integer not null references demos (id) on delete cascade,
  bid_id integer not null references bids (id) on delete cascade,
  amount_cents integer not null check (amount_cents > 0),
  kind text not null check (kind in ('bid', 'raise')),
  status text not null check (status = 'captured'),
  created_at timestamptz not null default now()
);

create index if not exists payments_user_idx on payments (user_id, created_at desc);

insert into demos (
  user_id, slug, title, company, pitch, category,
  video_url, video_kind, video_id, product_url, created_at
) values
  (
    'catalog', 'cursor-demos', 'Demos, not diffs', 'Cursor',
    'Agents test the product and send back a video of the work.',
    'ai',
    'https://www.youtube.com/watch?v=XbZvC4KTH68', 'youtube', 'XbZvC4KTH68',
    'https://cursor.com',
    now() - interval '1 hour'
  ),
  (
    'catalog', 'superhuman-go', 'Superhuman Go', 'Superhuman',
    'A launch walkthrough of Go, an assistant that works beside the tools you already use.',
    'ai',
    'https://www.youtube.com/watch?v=PUAzU57wt88', 'youtube', 'PUAzU57wt88',
    'https://www.superhuman.com',
    now() - interval '2 days'
  ),
  (
    'catalog', 'notion-ai-team', 'A day with the AI team', 'Notion',
    'Notion''s launch demo of an AI team working through a day.',
    'saas',
    'https://www.youtube.com/watch?v=sbpmdBtZS0Q', 'youtube', 'sbpmdBtZS0Q',
    'https://www.notion.com',
    now() - interval '5 days'
  ),
  (
    'catalog', 'raycast-two', '102 things in Raycast 2.0', 'Raycast',
    'A fast pass across the launcher, notes, window tools, and agents.',
    'tech',
    'https://www.youtube.com/watch?v=G7_7F_FBqQE', 'youtube', 'G7_7F_FBqQE',
    'https://www.raycast.com',
    now() - interval '9 days'
  ),
  (
    'catalog', 'raycast-launcher', 'The launcher', 'Raycast',
    'How Raycast opens apps and commands from the keyboard.',
    'saas',
    'https://www.youtube.com/watch?v=eRBCx3W4QOA', 'youtube', 'eRBCx3W4QOA',
    'https://www.raycast.com',
    now() - interval '20 days'
  )
on conflict (slug) do nothing;
