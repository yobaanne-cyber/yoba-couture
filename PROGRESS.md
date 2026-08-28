# Suivi d'avancement — YOBA COUTURE

Référence : cahier des charges v1.2, plan de réalisation en 10 étapes (§13).

## Décisions notables

- **Frontend : React 19** (et non React 18 comme indiqué au §10.1 du cahier des charges) — décision explicite du client, prise le 2026-08-28, pour bénéficier des dernières optimisations. React 19 est rétrocompatible avec l'API utilisée dans ce projet ; aucun impact sur le reste de la spécification.

## Étape 1 — Fondations ✅

- Projet Vite + React 19 + TypeScript scaffoldé.
- Tailwind CSS 4 configuré via `@tailwindcss/vite`.
- Dépendances installées : `react-router-dom`, `@supabase/supabase-js`, `framer-motion`, `browser-image-compression`.
- Structure des dossiers : `src/{components,pages,pages/admin,lib,hooks,types,styles}`.
- Alias `@/*` → `src/*` (Vite + tsconfig).
- `.env.example` créé (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_WHATSAPP_NUMBER`).
- `.gitignore` : `.env`, `.env.*`, `.mcp.json` exclus dès le premier commit.
- Client Supabase initialisé dans `src/lib/supabase.ts`.
- Page d'accueil temporaire (sera remplacée à l'étape 5).

## Étape 2 — Design system ✅

- Tokens couleur (palette §9.2) et typographiques (§9.3) via `@theme` Tailwind v4 (`src/styles/theme.css`).
- Polices : Playfair Display (titres), Inter (texte courant), DM Mono (références/prix), chargées via Google Fonts avec `preconnect` et `display=swap`.
- Composants verre `.glass` / `.glass-elevated` / `.glass-modal` (§9.1), avec repli `@supports not (backdrop-filter)` (`src/styles/glass.css`, `src/components/GlassPanel.tsx`).
- Fond rosé animé : 4 halos en `position: fixed`, `translate3d` + `hue-rotate` ±12°, cycles 65–90 s, uniquement `@keyframes` CSS (`src/styles/background.css`, `src/components/AnimatedBackground.tsx`). Coupé via `prefers-reduced-motion: reduce`.
- Mode sombre à trois états (clair/sombre/auto) : `ThemeProvider`/`useTheme` (`src/hooks/useTheme.tsx`), persistance `localStorage`, tokens redéfinis sous `[data-theme="dark"]` et `prefers-color-scheme`. Palette sombre dérivée (non spécifiée dans le cahier), à affiner si besoin.
- Élément signature : `ReferenceLabel` (référence-étiquette monospace or sur bandeau de verre, §9.4).
- Règle globale d'accessibilité `prefers-reduced-motion` appliquée dans `src/styles/base.css` (§11).
- Page d'accueil temporaire transformée en vitrine du design system pour validation visuelle (remplacée à l'étape 5). Vérifié en thème clair et sombre via `playwright screenshot`, aucune erreur console.

## Étape 3 — Base de données Supabase ✅ (partiel — workflows GitHub Actions en attente de validation)

- Schéma complet appliqué sur le projet Supabase (`gmocuntpogitstsmgwhu`, région eu-west-1) via 7 migrations (`supabase/migrations/`) : `profiles`/rôles protégés, catalogue (`categories`, `modes`, `fabrics`, `colors`, `products`, tables de jonction, `product_media` plafonné à 6 photos), `orders`/`favorites`/`reviews`/`measurements`, `hero_slides`/`site_settings`/`audit_log`.
- RLS activé sur les 19 tables, conforme au §10.3 (lecture publique produits/avis uniquement si publiés/approuvés, écriture staff, clés `site_settings` critiques réservées à l'owner, rôle protégé contre l'auto-élévation).
- Génération automatique des références (`YB-GB-0001`…) et numéros de commande (`CMD-2026-0001`…) par triggers.
- 2 buckets Storage créés (`product-media`, `site-assets`), publics en lecture, écriture staff uniquement, limite 512 Ko/fichier.
- Audit sécurité Supabase passé : `search_path` fixé sur toutes les fonctions, fonctions triggers retirées de l'exécution publique RPC, index FK manquants ajoutés.
- RLS vérifiées par simulation de rôle (`set local role anon`) : lecture publique OK, écriture bloquée, produit brouillon invisible.
- Jeu de données de test inséré (`supabase/seed.sql`) : 4 catégories, 11 modes, tissus, couleurs, 3 produits (2 publiés, 1 brouillon), réglages par défaut de `site_settings` (nom du site, modèle de message WhatsApp, etc.).
- Types TypeScript générés (`src/types/database.ts`), client Supabase typé (`src/lib/supabase.ts`).
- `.env` local rempli avec les vraies clés du projet (non commité).
- **En attente de validation utilisateur avant commit/push** (§10.7.6) : 2 workflows GitHub Actions écrits (`supabase-keep-alive.yml`, `supabase-backup.yml`). Découverte en cours de route : l'action `gautamkrishnar/keepalive-workflow` citée au §10.7.3 a été désactivée par GitHub pour violation des CGU (commits factices) ; remplacée par `liskin/gh-workflow-keepalive` (ré-activation via API officielle, aucun commit factice), intégrée comme étape finale dans chacun des deux workflows plutôt qu'un 3ᵉ fichier séparé. Sauvegardes poussées sur une branche `backups` dédiée du même dépôt (choix validé avec l'utilisateur).

## Étape 4 — Authentification

Non démarrée.

## Étape 5 — Catalogue public

Non démarrée.

## Étape 6 — Fiche modèle

Non démarrée.

## Étape 7 — Commande et partage

Non démarrée.

## Étape 8 — Avis

Non démarrée.

## Étape 9 — Espace admin

Non démarrée.

## Étape 10 — Finition et mise en production

Non démarrée.
