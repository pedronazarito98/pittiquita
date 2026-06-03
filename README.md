<div align="center">
  <img src="https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/logo.svg" width="132" alt="Mascote gatinho do pittiquita dormindo" />
  <h1>pittiquita</h1>
  <p>
    <strong>Capture componentes React vivos no localhost e leve para o Figma com o HTML to Design.</strong>
  </p>
  <p>
    Um painel de desenvolvimento pequeno, seguro para SSR e sem impacto em produção.
  </p>
  <p>
    <a href="https://www.npmjs.com/package/pittiquita"><img alt="versão no npm" src="https://img.shields.io/npm/v/pittiquita?color=6366f1&style=flat-square" /></a>
    <a href="https://www.npmjs.com/package/pittiquita"><img alt="downloads no npm" src="https://img.shields.io/npm/dm/pittiquita?color=0ea5e9&style=flat-square" /></a>
    <a href="https://bundlephobia.com/package/pittiquita"><img alt="tamanho do bundle" src="https://img.shields.io/bundlephobia/minzip/pittiquita?label=min%2Bgzip&color=22c55e&style=flat-square" /></a>
    <a href="https://github.com/pedronazarito98/pittiquita/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/pedronazarito98/pittiquita/actions/workflows/ci.yml/badge.svg" /></a>
    <a href="https://github.com/pedronazarito98/pittiquita/blob/main/LICENSE"><img alt="licença" src="https://img.shields.io/npm/l/pittiquita?color=111827&style=flat-square" /></a>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/pittiquita">npm</a>
    ·
    <a href="https://github.com/pedronazarito98/pittiquita">GitHub</a>
    ·
    <a href="https://github.com/pedronazarito98/pittiquita/issues">Issues</a>
    ·
    <a href="https://github.com/pedronazarito98/pittiquita/tree/main/docs/demo">Demo visual</a>
    ·
    <a href="https://github.com/pedronazarito98/pittiquita/blob/main/docs/README.en.md">English</a>
  </p>
</div>

---

## Visão geral

`pittiquita` acelera o fluxo Design <-> Code. Ele adiciona um painel de captura em apps React locais, permite marcar regiões úteis da página e prepara a URL atual do localhost para uso no plugin [HTML to Design](https://www.figma.com/community/plugin/1159123024924461424/html-to-design) do Figma.

| Feito para | Como ajuda |
| --- | --- |
| Handoff de UI real | Captura o estado renderizado pelo navegador, com props, CSS, dados e layout reais. |
| Fluxos locais seguros | Roda apenas em `localhost` e `127.0.0.1`, com guards para SSR. |
| Times de design e frontend | Dá um caminho rápido para importar telas e regiões sem DevTools. |
| Builds de produção | Mantém o pacote tree-shakeable e sem efeitos colaterais no import. |

## Navegação

| Comece por aqui | Referências |
| --- | --- |
| [Instalação](#instalação) | [Arquitetura](#arquitetura) |
| [Uso rápido](#uso-rápido) | [Entry points públicos](#arquitetura) |
| [Exemplo com Vite](#exemplo-com-vite) | [Scripts de desenvolvimento](#scripts-de-desenvolvimento) |
| [Exemplo com Next.js](#exemplo-com-nextjs) | [Segurança e privacidade](#segurança-e-privacidade) |

## Fluxo principal

```txt
localhost -> ativar captura -> copiar URL pronta -> colar no HTML to Design
```

| 1. Rode local | 2. Marque regiões | 3. Ative captura | 4. Importe no Figma |
| --- | --- | --- | --- |
| Abra seu app em `localhost`. | Use `FigmaTarget` ou `figmaTarget`. | O painel gera a URL com hash. | Cole a URL no HTML to Design. |

## Demo visual

O walkthrough mostra o painel de captura, a URL pronta e o passo de importação:

| Painel no localhost | Captura ativa |
| --- | --- |
| ![painel do pittiquita no localhost](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/01-localhost-panel.png) | ![captura ativa no pittiquita](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/02-capture-active.png) |

| Copiar URL | Passo no HTML to Design |
| --- | --- |
| ![URL de captura pronta no pittiquita](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/03-copy-url.png) | ![passo ilustrativo de importação no HTML to Design](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/04-figma-import-step.png) |

A última tela é um mock local ilustrativo. Ela documenta onde colar a URL no HTML to Design sem exigir login no Figma ou uma sessão real do plugin.

Gere novamente os screenshots com:

```bash
pnpm build
pnpm --dir playground install
pnpm run demo:capture
```

Se o Playwright não encontrar um navegador na sua máquina, instale o Chromium uma vez:

```bash
pnpm exec playwright install chromium
```

## O problema

Designers e engenheiros muitas vezes precisam inspecionar o estado real renderizado de um componente antes de levá-lo de volta ao Figma.

| Fluxo manual | Com `pittiquita` |
| --- | --- |
| Abrir DevTools e encontrar o node certo no DOM. | Ativar captura em um painel local. |
| Copiar HTML manualmente e torcer para preservar o estado visual. | Copiar a URL completa já preparada. |
| Repetir tudo quando props, layout ou dados mudam. | Reimportar a página viva no HTML to Design. |

Esse processo é frágil porque o que importa não é apenas o componente fonte. É o componente vivo, com props, CSS, dados, layout e estado renderizado pelo navegador.

## A solução

`pittiquita` adiciona um helper local de captura ao seu app React.

Com ele você pode:

- Ativar o modo de captura para Figma por um painel flutuante.
- Copiar a URL atual do localhost com o hash de captura pronto.
- Marcar regiões específicas da página como alvos nomeados.
- Navegar até esses alvos diretamente pelo painel.
- Manter a ferramenta de captura fora da produção.

O handoff fica simples: rode o app localmente, ative a captura, copie a URL e cole no plugin HTML to Design dentro do Figma.

## Quando usar

Use `pittiquita` quando você quiser:

- Levar estados reais de UI React para o Figma para revisão ou iteração.
- Documentar estados de componentes a partir de um ambiente local.
- Dar ao time de design um caminho estável para importar telas renderizadas sem DevTools.
- Capturar regiões específicas como hero, pricing, cards, formulários ou dashboards.
- Manter esse fluxo exclusivo de desenvolvimento e seguro para bundles de produção.

Ele não substitui design tokens, bibliotecas de componentes, Storybook ou componentes nativos do Figma. Ele é uma ponte para capturar estados HTML vivos rapidamente.

## Instalação

```bash
pnpm add pittiquita
```

Peer dependencies:

```txt
react >=18
react-dom >=18
```

## Uso rápido

Renderize o painel dentro de uma árvore React no cliente:

```tsx
import { FigmaCapturePanel } from 'pittiquita'

export function App() {
  return (
    <>
      <YourApplication />
      <FigmaCapturePanel />
    </>
  )
}
```

Inicie seu servidor de desenvolvimento e abra uma URL localhost. O painel retorna `null` fora de `localhost` e `127.0.0.1`.

## Exemplo com Next.js

No App Router, coloque um pequeno Client Component próximo ao layout raiz.

```tsx
// app/PittiquitaPanel.tsx
'use client'

import { usePathname } from 'next/navigation'
import { FigmaCapturePanel } from 'pittiquita'

export function PittiquitaPanel() {
  return <FigmaCapturePanel pathname={usePathname()} />
}
```

```tsx
// app/layout.tsx
import type { ReactNode } from 'react'
import { PittiquitaPanel } from './PittiquitaPanel'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        {process.env.NODE_ENV === 'development' ? <PittiquitaPanel /> : null}
      </body>
    </html>
  )
}
```

O guard `NODE_ENV` é opcional porque o componente já verifica localhost, mas ajuda bundlers a removerem UI exclusiva de desenvolvimento de branches de produção.

## Exemplo com Vite

Use o plugin do Vite para injetar o painel automaticamente durante `vite dev`:

```ts
// vite.config.ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { pittiquita } from 'pittiquita/vite'

export default defineConfig({
  plugins: [react(), pittiquita()],
})
```

O plugin Vite roda apenas durante o servidor de desenvolvimento. Builds de produção ficam intocados.

Você também pode renderizar `<FigmaCapturePanel />` manualmente em um app Vite se preferir controle explícito.

## Marcando regiões

Regiões marcadas aparecem no painel como atalhos nomeados. Ao selecionar uma, o painel rola até o elemento e destaca a área para captura.

### Com `FigmaTarget`

```tsx
import { FigmaTarget } from 'pittiquita'

export function MarketingPage() {
  return (
    <FigmaTarget name="hero-section" label="Hero">
      <section>
        <h1>UI pronta para design</h1>
      </section>
    </FigmaTarget>
  )
}
```

### Com `figmaTarget`

Use o helper quando não quiser criar um wrapper extra no DOM:

```tsx
import { figmaTarget } from 'pittiquita'

export function PricingCards() {
  return (
    <section {...figmaTarget('pricing-cards', { label: 'Pricing cards' })}>
      ...
    </section>
  )
}
```

As duas APIs escrevem os atributos `data-figma-target` e `data-figma-label`. O painel descobre essas regiões automaticamente com `MutationObserver`.

## Como a captura funciona

1. `FigmaCapturePanel` renderiza apenas em `localhost` ou `127.0.0.1`.
2. Clicar em `Activate capture` adiciona `#figmacapture=manual` à URL atual.
3. Quando esse hash está presente, o pittiquita injeta o script de captura do Figma HTML to Design.
4. Você copia a URL completa do localhost.
5. No Figma, abra o HTML to Design e importe por URL.
6. O plugin lê a página renderizada e recria a tela como camadas editáveis no Figma.

O painel marca a si mesmo com `data-figma-helper` para que a UI auxiliar possa ser ignorada pela lógica de captura.

## Hooks Headless

Se quiser criar sua própria UI, importe o entry point de hooks:

```tsx
import {
  useFigmaCapture,
  useFigmaFileRef,
  useFigmaRegions,
  useLocalOrigin,
} from 'pittiquita/hooks'

export function CustomCaptureToolbar() {
  const isLocal = useLocalOrigin()
  const { activate } = useFigmaCapture({ enabled: isLocal })
  const { regions } = useFigmaRegions({ enabled: isLocal })
  const fileRef = useFigmaFileRef()

  if (!isLocal) return null

  return (
    <div>
      <button type="button" onClick={activate}>
        Capturar
      </button>
      <span>{regions.length} regiões</span>
      <input value={fileRef.value} onChange={(event) => fileRef.setValue(event.target.value)} />
    </div>
  )
}
```

## Arquitetura

```txt
src/
  core/
    hooks/      hooks React com guards de browser
    utils/      captura, file-ref, labels e utilitários de regiões
    types.ts    tipos públicos compartilhados
  react/
    FigmaCapturePanel.tsx
    FigmaTarget.tsx
    components/
    styles.ts   estilos inline e CSS custom properties
  vite/
    plugin.ts   injeção Vite exclusiva de desenvolvimento
  next/
    plugin.ts   entry point auxiliar para configuração Next.js
tests/
  core/
  react/
playground/
  app demo Vite linkado ao pacote local
docs/demo/
  walkthrough visual gerado com Playwright
```

Entry points públicos:

| Import | Uso |
| --- | --- |
| `pittiquita` | Componentes, hooks, utilitários e tipos públicos |
| `pittiquita/hooks` | Hooks headless e utilitários |
| `pittiquita/vite` | Plugin Vite de desenvolvimento |
| `pittiquita/next` | Helper de configuração para Next.js |

## Scripts de desenvolvimento

Use `pnpm`.

```bash
pnpm install
pnpm test:run
pnpm typecheck
pnpm build
pnpm lint
pnpm validate
pnpm pack:check
pnpm run demo:capture
pnpm --dir playground dev
pnpm --dir playground build
```

O script de captura da demo espera que o pacote tenha sido compilado antes, porque o playground consome o pacote pai pelos exports públicos.

## Metadados do pacote

O pacote é publicado como ESM e CJS via `tsup`.

- `main`: `./dist/index.cjs`
- `module`: `./dist/index.js`
- `types`: `./dist/index.d.ts`
- `exports`: `.`, `./hooks`, `./vite`, `./next`
- `files`: `dist`, `README.md`, `LICENSE`
- `sideEffects`: `false`
- `license`: `MIT`

`sideEffects: false` é intencional porque o pacote não tem efeitos colaterais no momento da importação. O comportamento de captura só inicia quando consumidores renderizam o painel ou chamam hooks em contexto de navegador.

## Segurança e privacidade

- Nenhum `.env`, token, cookie ou credencial é exigido pelo pittiquita.
- O helper retorna `null` fora de origens locais de desenvolvimento.
- O pacote não envia dados para nenhum servidor do pittiquita.
- Ao ativar a captura, o script do Figma HTML to Design é carregado do domínio do Figma, e o comportamento de importação passa a ser controlado pelo plugin do Figma.
- Use dados de desenvolvimento ao importar telas sensíveis para o Figma.

## Roadmap

- Adicionar um mapa visual de regiões mais rico para páginas densas.
- Adicionar affordances opcionais para copiar a URL de captura.
- Melhorar a documentação para fluxos com design systems e Storybook.
- Adicionar mais exemplos para Next.js App Router e monorepos Vite.

## Licença

MIT (c) Pedro Nazarito. Veja [LICENSE](./LICENSE).
