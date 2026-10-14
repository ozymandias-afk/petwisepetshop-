-- Run in the Supabase SQL editor. Keep service-role keys server-side only.
create extension if not exists pgcrypto;
create table if not exists public.categories (
  slug text primary key,
  name jsonb not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null references public.categories(slug),
  name jsonb not null,
  description jsonb not null,
  price numeric(10,2) not null check (price >= 0),
  images text[] not null default '{}',
  image text,
  stock integer not null default 0 check (stock >= 0),
  active boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  email text,
  addresses jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid not null references public.customers(id),
  status text not null default 'New' check(status in ('New','Confirmed','Preparing','Out for delivery','Completed','Cancelled')),
  payment_method text not null check(payment_method in ('cod','cliq','card')),
  payment_status text not null default 'Pending' check(payment_status in ('Pending','Paid','Failed','Refunded')),
  delivery_type text not null check(delivery_type in ('delivery','pickup')),
  total numeric(10,2) not null check(total >= 0),
  notes text,
  delivery_city text,
  delivery_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_slug text not null,
  product_name jsonb not null,
  quantity integer not null check(quantity > 0),
  unit_price numeric(10,2) not null check(unit_price >= 0),
  line_total numeric(10,2) not null check(line_total >= 0),
  image text,
  created_at timestamptz not null default now()
);
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);
create or replace function public.is_petwise_admin()
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.admin_users where user_id=auth.uid()) $$;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admin_users enable row level security;
drop policy if exists "Public reads active categories" on public.categories;
create policy "Public reads active categories" on public.categories for select to anon, authenticated using (active = true or public.is_petwise_admin());
drop policy if exists "Public reads active products" on public.products;
create policy "Public reads active products" on public.products for select to anon, authenticated using (active = true or public.is_petwise_admin());
drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories" on public.categories for all to authenticated using (public.is_petwise_admin()) with check (public.is_petwise_admin());
drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products for all to authenticated using (public.is_petwise_admin()) with check (public.is_petwise_admin());
drop policy if exists "Admins manage customers" on public.customers;
create policy "Admins manage customers" on public.customers for all to authenticated using (public.is_petwise_admin()) with check (public.is_petwise_admin());
drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders" on public.orders for all to authenticated using (public.is_petwise_admin()) with check (public.is_petwise_admin());
drop policy if exists "Admins manage order items" on public.order_items;
create policy "Admins manage order items" on public.order_items for all to authenticated using (public.is_petwise_admin()) with check (public.is_petwise_admin());
drop policy if exists "Admins can view admin list" on public.admin_users;
create policy "Admins can view admin list" on public.admin_users for select to authenticated using (public.is_petwise_admin());
-- Order creation intentionally happens only through the server API using SUPABASE_SERVICE_ROLE_KEY.
-- Do not grant anonymous clients access to customer/order tables.
insert into public.categories(slug,name) values
('dog','{"ar":"الكلاب","en":"Dogs"}'),('cat','{"ar":"القطط","en":"Cats"}'),('birds','{"ar":"الطيور","en":"Birds"}'),('fish','{"ar":"الأسماك","en":"Fish"}'),('small-pets','{"ar":"الحيوانات الصغيرة","en":"Small Pets"}'),('accessories','{"ar":"الإكسسوارات","en":"Accessories"}')
on conflict(slug) do update set name=excluded.name;
insert into public.products(slug,category,name,description,price,images,image,stock,active,featured) values
('premium-adult-dog-food','dog','{"ar":"طعام كلاب جاف للبالغين - 10 كغ","en":"Premium Adult Dog Food - 10kg"}','{"ar":"تركيبة متوازنة غنية بالبروتين تدعم صحة العضلات والمفاصل ولمعان الفرو، مناسبة للكلاب البالغة من جميع السلالات.","en":"A balanced, protein-rich formula that supports healthy muscles, joints and a shiny coat. Suitable for adult dogs of all breeds."}',32.50,array['/images/products/dog-food.png'],'/images/products/dog-food.png',20,true,true),
('indoor-cat-food','cat','{"ar":"طعام قطط داخلية - 4 كغ","en":"Indoor Cat Food - 4kg"}','{"ar":"غذاء متكامل للقطط التي تعيش داخل المنزل، يساعد على التحكم بالوزن وتقليل كرات الشعر.","en":"Complete nutrition for indoor cats that helps with weight control and reduces hairballs."}',18,array['/images/products/cat-food.png'],'/images/products/cat-food.png',20,true,true),
('cat-scratching-tree','cat','{"ar":"شجرة خدش للقطط","en":"Cat Scratching Tree"}','{"ar":"برج متعدد الطوابق مع منصات ناعمة وأعمدة خدش متينة، يمنح قطتك مكانًا للعب والراحة.","en":"A multi-level tower with plush platforms and sturdy scratching posts, giving your cat a place to play and rest."}',45,array['/images/products/cat-tree.png'],'/images/products/cat-tree.png',12,true,true),
('bird-cage-classic','birds','{"ar":"قفص طيور كلاسيكي","en":"Classic Bird Cage"}','{"ar":"قفص معدني متين مع مجاثم خشبية ووعاء للطعام، مناسب للكناري والببغاوات الصغيرة.","en":"A sturdy metal cage with wooden perches and a food bowl, ideal for canaries and small parrots."}',38,array['/images/products/bird-cage.png'],'/images/products/bird-cage.png',8,true,false),
('starter-aquarium-kit','fish','{"ar":"حوض أسماك متكامل للمبتدئين","en":"Starter Aquarium Kit"}','{"ar":"حوض زجاجي أنيق يأتي مع فلتر وإضاءة، الخيار المثالي لبدء هواية تربية الأسماك.","en":"An elegant glass tank with a filter and lighting. The perfect way to start your fishkeeping hobby."}',55,array['/images/products/aquarium.png'],'/images/products/aquarium.png',5,true,true),
('wooden-small-pet-house','small-pets','{"ar":"بيت خشبي للحيوانات الصغيرة","en":"Wooden Small Pet House"}','{"ar":"مخبأ خشبي طبيعي وآمن للهامستر والأرانب وخنازير غينيا.","en":"A safe, natural wooden hideout for hamsters, rabbits and guinea pigs."}',14.50,array['/images/products/small-pet-house.png'],'/images/products/small-pet-house.png',10,true,false),
('red-leash-collar-set','accessories','{"ar":"طقم رسن وطوق أحمر","en":"Red Leash & Collar Set"}','{"ar":"رسن نايلون متين مع طوق مبطن مريح وقابل للتعديل لنزهات يومية آمنة.","en":"A durable nylon leash with a comfortable, adjustable padded collar for safe daily walks."}',12,array['/images/products/leash.png'],'/images/products/leash.png',20,true,true),
('plush-round-pet-bed','accessories','{"ar":"سرير دائري ناعم للحيوانات","en":"Plush Round Pet Bed"}','{"ar":"سرير مريح وناعم جدًا يمنح حيوانك الأليف نومًا هادئًا، قابل للغسل.","en":"An extra-soft, cozy bed that gives your pet calm, restful sleep. Machine washable."}',28,array['/images/products/pet-bed.png'],'/images/products/pet-bed.png',15,true,true)
on conflict(slug) do nothing;
-- Create a public bucket for product imagery. Keep customer/order data in private tables.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('product-images','product-images',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do nothing;
drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images" on storage.objects for insert to authenticated with check(bucket_id='product-images' and public.is_petwise_admin());
drop policy if exists "Admins update product images" on storage.objects;
create policy "Admins update product images" on storage.objects for update to authenticated using(bucket_id='product-images' and public.is_petwise_admin()) with check(bucket_id='product-images' and public.is_petwise_admin());
drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images" on storage.objects for delete to authenticated using(bucket_id='product-images' and public.is_petwise_admin());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('payment-proofs','payment-proofs',false,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do nothing;
-- No public policies for payment-proofs: only server-side service-role access is permitted.

drop policy if exists "Admins read payment proofs" on storage.objects;
create policy "Admins read payment proofs" on storage.objects for select to authenticated using(bucket_id='payment-proofs' and public.is_petwise_admin());
