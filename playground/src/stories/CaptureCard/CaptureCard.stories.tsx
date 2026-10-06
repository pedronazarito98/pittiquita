import type { Meta, StoryObj } from '@storybook/react-vite'
import type { PittiquitaStorybookOptions } from 'pittiquita/storybook'

import { CaptureCard } from './CaptureCard'

const meta = {
  title: 'Pittiquita/Capture Card',
  component: CaptureCard,
  tags: ['autodocs'],
  args: {
    title: 'Do componente ao Figma',
    appearance: 'light',
  },
  argTypes: {
    appearance: { control: 'inline-radio', options: ['light', 'dark'] },
  },
} satisfies Meta<typeof CaptureCard>

export default meta
type Story = StoryObj<typeof meta>

export const Light: Story = {}

export const Dark: Story = {
  args: { appearance: 'dark' },
  parameters: {
    pittiquita: {
      label: 'Card escuro',
      theme: {
        panelBg: '#1a202c',
        borderColor: '#4a5568',
        textPrimary: '#f7fafc',
        textSecondary: '#e2e8f0',
        textMuted: '#cbd5e0',
      },
    } satisfies PittiquitaStorybookOptions,
  },
}

export const WithoutPanel: Story = {
  parameters: { pittiquita: false },
}

export const NamedRegionsOnly: Story = {
  parameters: {
    pittiquita: { target: false } satisfies PittiquitaStorybookOptions,
  },
}
