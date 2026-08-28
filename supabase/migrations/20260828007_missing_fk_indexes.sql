create index if not exists audit_log_actor_idx on public.audit_log (actor_id);
create index if not exists favorites_product_idx on public.favorites (product_id);
create index if not exists measurements_user_idx on public.measurements (user_id);
create index if not exists product_colors_color_idx on public.product_colors (color_id);
create index if not exists product_fabrics_fabric_idx on public.product_fabrics (fabric_id);
create index if not exists product_modes_mode_idx on public.product_modes (mode_id);
create index if not exists reviews_user_idx on public.reviews (user_id);
create index if not exists site_settings_updated_by_idx on public.site_settings (updated_by);
