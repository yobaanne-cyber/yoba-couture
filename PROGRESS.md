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

## Étape 3 — Base de données Supabase

Non démarrée.

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
