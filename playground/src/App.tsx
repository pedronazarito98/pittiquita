import { useState } from 'react'
import {
  FigmaCapturePanel,
  FigmaTarget,
  figmaTarget,
  type PanelPosition,
  type RegionEntry,
} from 'pittiquita'

const positions: PanelPosition[] = ['bottom-right', 'bottom-left', 'top-right', 'top-left']

export function App() {
  const [position, setPosition] = useState<PanelPosition>('bottom-right')
  const [showNested, setShowNested] = useState(true)
  const [eventLog, setEventLog] = useState<string[]>([])

  const log = (msg: string) =>
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 20))

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', paddingBottom: '300px' }}>
      <h1>🎨 pittiquita playground</h1>
      <p style={{ color: '#718096' }}>
        Teste completo de <code>FigmaTarget</code>, <code>figmaTarget()</code> e{' '}
        <code>FigmaCapturePanel</code>.
      </p>

      {/* --- Controls --- */}
      <FigmaTarget name="controls" label="Playground Controls">
        <section style={{ padding: '20px', background: '#fefcbf', borderRadius: '12px', marginBottom: '24px' }}>
          <h2 style={{ marginTop: 0 }}>⚙️ Controles</h2>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <label>
              Posição do painel:{' '}
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as PanelPosition)}
                style={{ padding: '4px 8px' }}
              >
                {positions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="checkbox"
                checked={showNested}
                onChange={(e) => setShowNested(e.target.checked)}
              />
              Mostrar seção dinâmica
            </label>
          </div>
        </section>
      </FigmaTarget>

      {/* --- FigmaTarget component wrapper --- */}
      <FigmaTarget name="hero-section" label="Hero">
        <section style={{ padding: '32px', background: '#f7fafc', borderRadius: '12px', marginBottom: '24px' }}>
          <h2 style={{ marginTop: 0 }}>🏠 Hero Section</h2>
          <p>Esta seção usa <code>&lt;FigmaTarget&gt;</code> como wrapper.</p>
        </section>
      </FigmaTarget>

      {/* --- figmaTarget() spread utility --- */}
      <div
        style={{ marginBottom: '24px' }}
        {...figmaTarget('stats-cards', { label: 'Stats Cards' })}
      >
        <h2>📊 Stats Cards</h2>
        <p style={{ color: '#718096', marginTop: 0 }}>
          Esta seção usa <code>figmaTarget()</code> via spread de atributos.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {['Receita', 'Usuários', 'Conversão'].map((title, i) => (
            <div
              key={title}
              style={{ padding: '16px', background: '#edf2f7', borderRadius: '8px', textAlign: 'center' }}
              {...figmaTarget(`stat-card-${i}`, { label: title })}
            >
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{(i + 1) * 1234}</div>
              <div style={{ color: '#718096', fontSize: '14px' }}>{title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* --- FigmaTarget with custom `as` element --- */}
      <FigmaTarget name="custom-element" label="Article Tag" as="article">
        <div style={{ padding: '24px', background: '#e9d8fd', borderRadius: '12px', marginBottom: '24px' }}>
          <h2 style={{ marginTop: 0 }}>📝 Custom Element</h2>
          <p>
            Esta seção usa <code>as="article"</code> para renderizar como <code>&lt;article&gt;</code>.
          </p>
        </div>
      </FigmaTarget>

      {/* --- Nested FigmaTargets --- */}
      <FigmaTarget name="nested-outer" label="Nested Outer">
        <section style={{ padding: '24px', background: '#c6f6d5', borderRadius: '12px', marginBottom: '24px' }}>
          <h2 style={{ marginTop: 0 }}>🪆 Nested Targets</h2>
          <p>FigmaTarget externo contendo targets internos.</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <FigmaTarget name="nested-child-a" label="Child A">
              <div style={{ padding: '16px', background: '#9ae6b4', borderRadius: '8px', flex: 1 }}>
                Child A
              </div>
            </FigmaTarget>
            <FigmaTarget name="nested-child-b" label="Child B">
              <div style={{ padding: '16px', background: '#68d391', borderRadius: '8px', flex: 1 }}>
                Child B
              </div>
            </FigmaTarget>
          </div>
        </section>
      </FigmaTarget>

      {/* --- Dynamic section (toggle) --- */}
      {showNested && (
        <FigmaTarget name="dynamic-section" label="Dynamic Section">
          <section style={{ padding: '24px', background: '#fed7d7', borderRadius: '12px', marginBottom: '24px' }}>
            <h2 style={{ marginTop: 0 }}>⚡ Seção Dinâmica</h2>
            <p>
              Esta seção é renderizada condicionalmente. O <code>useFigmaRegions</code> deve
              detectá-la automaticamente via MutationObserver.
            </p>
          </section>
        </FigmaTarget>
      )}

      {/* --- Auto-label (no explicit label) --- */}
      <FigmaTarget name="auto-label-test">
        <section style={{ padding: '24px', background: '#bee3f8', borderRadius: '12px', marginBottom: '24px' }}>
          <h2 style={{ marginTop: 0 }}>🏷️ Auto-Label</h2>
          <p>
            Sem <code>label</code> explícito — o nome <code>"auto-label-test"</code> será
            transformado via <code>prettifyLabel()</code>.
          </p>
        </section>
      </FigmaTarget>

      {/* --- Event log --- */}
      <FigmaTarget name="event-log" label="Event Log">
        <section style={{ padding: '24px', background: '#fefcbf', borderRadius: '12px', marginBottom: '24px' }}>
          <h2 style={{ marginTop: 0 }}>📋 Event Log</h2>
          <div
            style={{
              background: '#1a202c',
              color: '#68d391',
              padding: '12px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '12px',
              maxHeight: '200px',
              overflowY: 'auto',
            }}
          >
            {eventLog.length === 0 ? (
              <span style={{ color: '#718096' }}>
                Interaja com o FigmaCapturePanel para ver os eventos aqui.
              </span>
            ) : (
              eventLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </section>
      </FigmaTarget>

      {/* --- FigmaCapturePanel (main widget) --- */}
      <FigmaCapturePanel
        position={position}
        labels={{
          panelTitle: 'Pittiquita Capture',
        }}
        onCaptureActivate={() => log('Capture ativado')}
        onRegionSelect={(region: RegionEntry) => log(`Região selecionada: ${region.label} (${region.id})`)}
      />
    </div>
  )
}
