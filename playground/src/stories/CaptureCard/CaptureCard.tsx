import { useState } from 'react'
import { figmaTarget } from 'pittiquita'

import { cardStyle, buttonStyle } from './CaptureCard.styles'

type CaptureCardProps = {
  title: string
  appearance: 'light' | 'dark'
}

export function CaptureCard({ title, appearance }: CaptureCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article style={cardStyle(appearance)}>
      <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em' }}>
        PITTIQUITA / STORYBOOK
      </span>
      <header {...figmaTarget('card-heading', { label: 'Card Header' })}>
        <h1 style={{ fontSize: '30px', lineHeight: 1.15 }}>{title}</h1>
        <p style={{ lineHeight: 1.6 }}>
          Capture o componente com as props e o estado que você está vendo.
          Experimente os Controls e as regiões nomeadas do painel.
        </p>
      </header>
      <button
        type="button"
        style={buttonStyle}
        aria-expanded={expanded}
        onClick={() => setExpanded((current) => !current)}
      >
        {expanded ? 'Ocultar detalhes' : 'Mostrar detalhes'}
      </button>
      {expanded && (
        <section
          {...figmaTarget('card-details', { label: 'Detalhes do card' })}
          style={{ marginTop: '20px', borderTop: '1px solid currentColor' }}
        >
          <p>Esta região aparece e desaparece sem recarregar a story.</p>
        </section>
      )}
    </article>
  )
}
