insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('product-media', 'product-media', true, 524288, array['image/webp','image/jpeg','image/png']),
  ('site-assets', 'site-assets', true, 524288, array['image/webp','image/jpeg','image/png','image/svg+xml','image/x-icon'])
on conflict (id) do nothing;

create policy "product_media_bucket_public_read" on storage.objects for select
  using (bucket_id = 'product-media');
create policy "product_media_bucket_staff_write" on storage.objects for insert
  with check (bucket_id = 'product-media' and public.is_admin_or_owner());
create policy "product_media_bucket_staff_update" on storage.objects for update
  using (bucket_id = 'product-media' and public.is_admin_or_owner())
  with check (bucket_id = 'product-media' and public.is_admin_or_owner());
create policy "product_media_bucket_staff_delete" on storage.objects for delete
  using (bucket_id = 'product-media' and public.is_admin_or_owner());

create policy "site_assets_bucket_public_read" on storage.objects for select
  using (bucket_id = 'site-assets');
create policy "site_assets_bucket_staff_write" on storage.objects for insert
  with check (bucket_id = 'site-assets' and public.is_admin_or_owner());
create policy "site_assets_bucket_staff_update" on storage.objects for update
  using (bucket_id = 'site-assets' and public.is_admin_or_owner())
  with check (bucket_id = 'site-assets' and public.is_admin_or_owner());
create policy "site_assets_bucket_staff_delete" on storage.objects for delete
  using (bucket_id = 'site-assets' and public.is_admin_or_owner());
