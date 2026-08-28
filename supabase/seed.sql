-- Jeu de données de test (§13, étape 3). Les images produits utilisent des
-- URL de substitution (picsum.photos) à remplacer par de vraies photos
-- lors de l'alimentation du catalogue par l'atelier.

insert into public.site_settings (key, value) values
  ('site_name', '"YOBA COUTURE"'),
  ('tagline', '"Le vestiaire sur mesure"'),
  ('logo_url', 'null'),
  ('logo_light_url', 'null'),
  ('favicon_url', 'null'),
  ('default_share_image_url', 'null'),
  ('whatsapp_number', '"221000000000"'),
  ('whatsapp_secondary_numbers', '[]'),
  ('whatsapp_message_template', '"Bonjour YOBA COUTURE 👋\n\nJe souhaite commander :\n▸ Modèle : {modele}\n▸ Référence : {reference}\n▸ Tissu : {tissu}\n▸ Couleur : {couleur}\n▸ Quantité : {quantite}\n▸ Taille : {taille}\n▸ Prix indiqué : {prix}\n\nNote : {note}\n\nVoir le modèle :\n{lien}\n\n— Commande n° {numero_commande}"'),
  ('contact_phone', '"221000000000"'),
  ('contact_email', '""'),
  ('address', '""'),
  ('google_maps_url', '""'),
  ('opening_hours', '{}'),
  ('closed_message', '"L''atelier est fermé, nous répondons dès 9 h."'),
  ('accent_hue_shift', '12'),
  ('hero_slide_interval_ms', '5000'),
  ('animations_enabled', 'true'),
  ('dark_mode_policy', '"auto"'),
  ('announcement_banner', '{"enabled": false, "text": "", "link": "", "color": "", "start_date": null, "end_date": null}'),
  ('currency', '"XOF"'),
  ('price_display_mode', '"visible"'),
  ('negotiable_price_label', '"Prix sur demande"'),
  ('deposit_percentage', '50'),
  ('default_production_days', '"7 à 10 jours"'),
  ('instagram_url', '""'),
  ('facebook_url', '""'),
  ('tiktok_url', '""'),
  ('youtube_url', '""'),
  ('seo_default_title', '"YOBA COUTURE — Atelier de couture sur mesure"'),
  ('seo_default_description', '"Grand boubou, caftan, tailleur sur mesure. Catalogue et commande en ligne, livraison Sénégal et diaspora."'),
  ('google_analytics_id', '""'),
  ('meta_pixel_id', '""'),
  ('review_moderation_mode', '"manual"'),
  ('maintenance_mode', '{"enabled": false, "message": ""}'),
  ('watermark', '{"enabled": false, "position": "bottom-right", "opacity": 0.3}')
on conflict (key) do nothing;

insert into public.categories (name, slug, code, description, position, is_visible) values
  ('Grand Boubou', 'grand-boubou', 'GB', 'Grands boubous brodés et unis, du modèle simple à la pièce de cérémonie.', 1, true),
  ('Caftan', 'caftan', 'CF', 'Caftans courts et longs, brodés main ou avec ceinture.', 2, true),
  ('Tailleur', 'tailleur', 'TL', 'Tailleurs deux et trois pièces, col mao.', 3, true),
  ('Ensemble Enfant', 'ensemble-enfant', 'EE', 'Tenues pour enfants, du baptême aux cérémonies.', 4, true)
on conflict (slug) do nothing;

insert into public.modes (category_id, name, slug, position)
select c.id, m.name, m.slug, m.position
from public.categories c
join (values
  ('grand-boubou', 'Modèle simple', 'modele-simple', 1),
  ('grand-boubou', 'Brodé', 'brode', 2),
  ('grand-boubou', 'Bazin riche', 'bazin-riche', 3),
  ('grand-boubou', 'Grand format cérémonie', 'grand-format-ceremonie', 4),
  ('caftan', 'Court', 'court', 1),
  ('caftan', 'Long', 'long', 2),
  ('caftan', 'Brodé main', 'brode-main', 3),
  ('caftan', 'Avec ceinture', 'avec-ceinture', 4),
  ('tailleur', 'Deux pièces', 'deux-pieces', 1),
  ('tailleur', 'Trois pièces', 'trois-pieces', 2),
  ('tailleur', 'Col mao', 'col-mao', 3)
) as m(category_slug, name, slug, position) on m.category_slug = c.slug
on conflict (category_id, slug) do nothing;

insert into public.fabrics (name) values
  ('Bazin riche'), ('Getzner'), ('Wax'), ('Satin'), ('Lin')
on conflict (name) do nothing;

insert into public.colors (name, hex) values
  ('Blanc cassé', '#FDFBFB'),
  ('Or', '#C9A227'),
  ('Bordeaux', '#7A2E3A'),
  ('Bleu nuit', '#1B2A4A'),
  ('Vert émeraude', '#0F5C42')
on conflict (name) do nothing;

with cat as (select id from public.categories where slug = 'grand-boubou'),
ins as (
  insert into public.products (name, slug, category_id, description, price, price_type, availability, production_days, gender, is_featured, status, published_at)
  select 'Grand Boubou Brodé Or', 'grand-boubou-brode-or', cat.id,
    'Bazin riche, broderie main au col et aux poignets. Sur mesure.',
    65000, 'fixed', 'sur_commande', '7 à 10 jours', 'homme', true, 'published', now()
  from cat
  returning id
)
insert into public.product_media (product_id, url_full, url_thumb, position, alt_text)
select ins.id, 'https://picsum.photos/seed/ybgb0001-full/1400/1750', 'https://picsum.photos/seed/ybgb0001-thumb/500/625', 1, 'Grand Boubou Brodé Or — face (donnée de test)'
from ins;

with cat as (select id from public.categories where slug = 'caftan')
insert into public.products (name, slug, category_id, description, price, price_type, availability, production_days, gender, status, published_at)
select 'Caftan Long Bazin', 'caftan-long-bazin', cat.id,
  'Caftan long en bazin riche, ceinture assortie.', 35000, 'from', 'piece_disponible', '5 à 7 jours', 'femme', 'published', now()
from cat;

with cat as (select id from public.categories where slug = 'tailleur')
insert into public.products (name, slug, category_id, description, price_type, availability, production_days, gender, status)
select 'Tailleur Trois Pièces Col Mao', 'tailleur-trois-pieces-col-mao', cat.id,
  'Tailleur trois pièces, col mao, sur mesure exclusivement.', 'negotiable', 'sur_commande_uniquement', '10 à 14 jours', 'homme', 'draft'
from cat;
