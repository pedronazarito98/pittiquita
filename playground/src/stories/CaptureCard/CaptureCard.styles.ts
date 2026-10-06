import type { CSSProperties } from 'react'

export const cardStyle = (appearance: 'light' | 'dark'): CSSProperties => ({
  width: 'min(420px, calc(100vw - 64px))',
  boxSizing: 'border-box',
  padding: '32px',
  borderRadius: '20px',
  fontFamily: 'system-ui, sans-serif',
  background: appearance === 'dark' ? '#1a202c' : '#f7fafc',
  color: appearance === 'dark' ? '#f7fafc' : '#1a202c',
  border: `1px solid ${appearance === 'dark' ? '#4a5568' : '#cbd5e0'}`,
})

export const buttonStyle: CSSProperties = {
  padding: '12px 18px',
  border: 0,
  borderRadius: '10px',
  background: '#6d28d9',
  color: '#fff',
  font: 'inherit',
  cursor: 'pointer',
}
