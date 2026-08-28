import GlassPanel from '@/components/GlassPanel'
import ReferenceLabel from '@/components/ReferenceLabel'
import { useTheme, type Theme } from '@/hooks/useTheme'

const swatches = [
  { name: 'Rose Poudre', varName: '--color-rose-poudre' },
  { name: 'Rose Argile', varName: '--color-rose-argile' },
  { name: 'Terre de Rose', varName: '--color-terre-rose' },
  { name: 'Prune Encre', varName: '--color-prune-encre' },
  { name: 'Or Fil', varName: '--color-or-fil' },
  { name: 'Blanc Coton', varName: '--color-blanc-coton' },
]

const themes: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
  { value: 'auto', label: 'Auto' },
]

export default function Home() {
  const { theme, setTheme } = useTheme()

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-6 py-16">
      <GlassPanel level="elevated" className="flex flex-wrap items-center justify-between gap-4 px-5 py-3">
        <span className="font-serif text-title">YOBA COUTURE</span>
        <div className="flex gap-2">
          {themes.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTheme(t.value)}
              className={
                'rounded-full px-3 py-1 text-caption transition-colors ' +
                (theme === t.value ? 'bg-or-fil text-prune-encre' : 'text-prune-encre/70 hover:text-prune-encre')
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </GlassPanel>

      <header className="flex flex-col gap-3">
        <h1 className="font-serif text-hero">Le vestiaire sur mesure</h1>
        <p className="max-w-xl text-body">
          Design system — palette, typographie et surfaces de verre de YOBA COUTURE. Cette page sera remplacée par
          l'accueil définitif à l'étape 5.
        </p>
        <ReferenceLabel reference="YB-GB-0142" className="w-fit" />
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <GlassPanel level="surface" className="p-5">
          <p className="text-caption text-prune-encre/70">Surface</p>
          <p className="text-body">flou 16px — cartes</p>
        </GlassPanel>
        <GlassPanel level="elevated" className="p-5">
          <p className="text-caption text-prune-encre/70">Élevée</p>
          <p className="text-body">flou 24px — navigation, filtres</p>
        </GlassPanel>
        <GlassPanel level="modal" className="p-5">
          <p className="text-caption text-prune-encre/70">Modale</p>
          <p className="text-body">flou 40px — panneaux de commande</p>
        </GlassPanel>
      </section>

      <section className="flex flex-wrap gap-3">
        {swatches.map((s) => (
          <div key={s.varName} className="flex flex-col items-center gap-2">
            <span
              className="h-14 w-14 rounded-full border border-black/10"
              style={{ background: `var(${s.varName})` }}
            />
            <span className="text-caption">{s.name}</span>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-2">
        <p className="text-tag uppercase tracking-wide text-prune-encre/60">Échelle typographique</p>
        <p className="text-hero font-serif leading-none">Hero 64</p>
        <p className="text-display font-serif leading-none">Display 40</p>
        <p className="text-title font-serif leading-none">Title 28</p>
        <p className="text-subtitle">Subtitle 20</p>
        <p className="text-body">Body 16</p>
        <p className="text-caption">Caption 14</p>
        <p className="font-mono text-tag text-or-fil">Tag / référence 12 — YB-GB-0142</p>
      </section>
    </main>
  )
}
