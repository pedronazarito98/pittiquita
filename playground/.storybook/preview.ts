import type { Preview } from '@storybook/react-vite'
import { withPittiquita } from 'pittiquita/storybook'

const preview = {
  decorators: process.env.NODE_ENV === 'development' ? [withPittiquita()] : [],
  parameters: {
    layout: 'centered',
  },
} satisfies Preview

export default preview
