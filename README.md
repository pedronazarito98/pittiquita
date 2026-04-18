<div align="center">
  <img src="./docs/logo.svg" width="120" alt="pittiquita logo" />
  <h1>pittiquita</h1>
  <p><strong>Manda seus componentes React direto pro Figma — um clique, sem copy-paste, sem ginástica no DevTools.</strong></p>
  <p>
    <a href="https://www.npmjs.com/package/pittiquita"><img alt="npm version" src="https://img.shields.io/npm/v/pittiquita?color=6366f1&style=flat-square" /></a>
    <a href="https://bundlephobia.com/package/pittiquita"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/pittiquita?label=min%2Bgzip&style=flat-square&color=22c55e" /></a>
    <img alt="tests" src="https://img.shields.io/badge/tests-58%20passing-brightgreen?style=flat-square" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178c6?style=flat-square&logo=typescript&logoColor=white" />
    <a href="LICENSE"><img alt="license" src="https://img.shields.io/npm/l/pittiquita?style=flat-square" /></a>
  </p>
  <p>
    Funciona com o plugin oficial <a href="https://www.figma.com/community/plugin/1159123024924461424">HTML to Design</a> do Figma.<br/>
    Só no localhost. Zero impacto em produção. SSR-safe.
  </p>
</div>

---

## O problema

O fluxo normal pra capturar um componente vivo pro Figma costuma ser assim:

1. Abre o DevTools
2. Caça o elemento certo no painel de Elements
3. Copia o HTML externo na mão
4. Cola no plugin HTML to Design
5. Fica se perguntando por que ficou diferente do que tá renderizado
6. Repete tudo

O `pittiquita` substitui tudo isso por um painel flutuante que só existe no `localhost`. Clica em **Activate capture**, cola a URL no plugin do Figma, pronto. Você também pode marcar regiões específicas da página como alvos nomeados — cada uma vira um botão de atalho no painel.

**Retorna `null` em produção.** A verificação de localhost acontece antes de qualquer renderização, o pacote é tree-shakeable, e `sideEffects: false` garante que os bundlers não vão incluí-lo a menos que você realmente use.

---

## Demo

```
┌─────────────────────────────┐
│ 🎯 pittiquita          _ □  │
│─────────────────────────────│
│ [ Activate capture ]        │
│                             │
│ Regions                     │
│ ┌──────────┐ ┌───────────┐  │
│ │   Hero   │ │  Pricing  │  │
│ └──────────┘ └───────────┘  │
│ ┌──────────┐                │
│ │  Footer  │                │
│ └──────────┘                │
│─────────────────────────────│
│ Figma file ref: [________]  │
└─────────────────────────────┘
```

> Uma gravação de tela de verdade tá chegando. Por enquanto, imagina um painel discreto no canto inferior direito do seu servidor de desenvolvimento.

---

## Instalação

```bash
pnpm add pittiquita
# or
npm install pittiquita
# or
yarn add pittiquita
```

**Peer deps:** `react >=18` e `react-dom >=18` (testado no React 18 e 19).

---

## Início rápido

Joga o `<FigmaCapturePanel />` no layout raiz e esquece:

```tsx
// app/layout.tsx (Next.js) or src/main.tsx (Vite)
import { FigmaCapturePanel } from "pittiquita";

export default function Layout({ children }) {
  return (
    <>
      {children}
      <FigmaCapturePanel />
    </>
  );
}
```

Roda `pnpm dev`, abre `http://localhost:xxxx`, e o painel vai estar lá te esperando. Clica em **Activate capture**, copia a URL (com o hash), cola no plugin **HTML to Design** dentro do Figma. É isso.

---

## Marcando regiões

Regiões permitem criar atalhos nomeados para partes específicas da página. Elas aparecem como botões no painel — clicar em uma delas rola a página até aquele elemento e o destaca no DOM.

### Componente wrapper

```tsx
import { FigmaTarget } from "pittiquita";

<FigmaTarget name="hero-section" label="Hero">
  <section className="hero">...</section>
</FigmaTarget>;
```

### Spread helper (sem nó extra no DOM)

```tsx
import { figmaTarget } from "pittiquita";

<section {...figmaTarget("hero-section", { label: "Hero" })}>...</section>;
```

Os dois jeitos escrevem os atributos `data-figma-target` e `data-figma-label` no elemento. O painel os descobre automaticamente via `MutationObserver` — sem precisar dar refresh manual.

---

## Hooks headless

Não quer o painel pronto? Importa só os hooks e monta sua própria UI:

```tsx
import {
  useLocalOrigin,
  useFigmaCapture,
  useFigmaRegions,
  useFigmaFileRef,
} from "pittiquita/hooks";

function MyDevPanel() {
  const isLocal = useLocalOrigin(); // SSR-safe — começa false, atualiza após a montagem
  const { isActive, activate, reset } = useFigmaCapture();
  const { regions, refresh } = useFigmaRegions();
  const { value, setValue, openExistingFile } = useFigmaFileRef();

  if (!isLocal) return null;

  return (
    <div>
      <button onClick={activate}>Capture</button>
      <ul>
        {regions.map((r) => (
          <li key={r.name}>{r.label ?? r.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

Todos os hooks são SSR-safe e só fazem trabalho de verdade no cliente, e apenas no `localhost`.

### Referência dos hooks

| Hook                        | Retorna                                 | Observações                                         |
| --------------------------- | --------------------------------------- | --------------------------------------------------- |
| `useLocalOrigin()`          | `boolean`                               | `true` apenas em `localhost` / `127.0.0.1`          |
| `useFigmaCapture(options?)` | `{ isActive, activate, reset }`         | Injeta o script do Figma ao ativar                  |
| `useFigmaRegions(options?)` | `{ regions, refresh }`                  | Reativo via `MutationObserver` + debounce com `rAF` |
| `useFigmaFileRef()`         | `{ value, setValue, openExistingFile }` | Persiste no `localStorage`                          |

---

## Plugins de build

### Vite

O plugin do Vite injeta o painel automaticamente numa shadow root durante o `dev` — nada toca no build de produção.

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { pittiquita } from "pittiquita/vite";

export default defineConfig({
  plugins: [react(), pittiquita()],
});
```

O plugin só roda com `apply: 'serve'`. O output do build sai limpo.

### Next.js (App Router)

Nenhum plugin necessário. Importa o componente direto no layout raiz:

```tsx
// app/layout.tsx
import { FigmaCapturePanel } from "pittiquita";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        {process.env.NODE_ENV === "development" && <FigmaCapturePanel />}
      </body>
    </html>
  );
}
```

O guard `process.env.NODE_ENV` é opcional (o componente já retorna `null` fora do localhost), mas é uma boa prática pra manter código exclusivo de dev fora do bundle de produção.

---

## Customização

### Tokens de tema

Todos os estilos visuais são controlados por CSS custom properties. Passa um objeto `theme` parcial — só o que você quer sobrescrever:

```tsx
<FigmaCapturePanel
  theme={{
    accentColor: "#8b5cf6",
    panelBg: "#0f172a",
    textPrimary: "#f8fafc",
    borderRadius: "12px",
  }}
/>
```

| Token           | Padrão    | Descrição                 |
| --------------- | --------- | ------------------------- |
| `panelBg`       | `#ffffff` | Fundo do painel           |
| `borderColor`   | `#e2e8f0` | Borda do painel           |
| `borderRadius`  | `8px`     | Arredondamento das bordas |
| `accentColor`   | `#6366f1` | Botões e destaques        |
| `textPrimary`   | `#0f172a` | Texto principal           |
| `textSecondary` | `#475569` | Texto secundário          |
| `textMuted`     | `#94a3b8` | Texto suave / placeholder |
| `fontFamily`    | system-ui | Fonte do painel           |
| `fontSize`      | `13px`    | Tamanho base da fonte     |
| `gap`           | `8px`     | Espaçamento interno       |
| `padding`       | `12px`    | Padding do painel         |
| `zIndex`        | `9999`    | Ordem de empilhamento     |

### Labels (i18n)

Sobrescreve qualquer string. O resto cai no padrão em inglês:

```tsx
<FigmaCapturePanel
  labels={{
    panelTitle: "Capturar para Figma",
    activateCapture: "Ativar",
    reset: "Limpar",
    regionsTitle: "Regiões marcadas",
    regionsEmpty: "Nenhuma região marcada",
  }}
/>
```

### Slots de classes CSS (pronto para Tailwind)

```tsx
<FigmaCapturePanel
  classNames={{
    header: "border-b border-slate-200 pb-2",
    actions: "flex gap-3",
    regionList: "max-h-72 overflow-y-auto",
    fileField: "mt-2",
    hiddenBar: "opacity-50",
  }}
/>
```

### Posição do painel

```tsx
<FigmaCapturePanel position="top-left" />
```

Opções: `'bottom-right'` _(padrão)_ · `'bottom-left'` · `'top-right'` · `'top-left'`

### Callbacks

```tsx
<FigmaCapturePanel
  onCaptureActivate={() => analytics.track("figma_capture_activated")}
  onRegionSelect={(region) => console.log("jumped to:", region.label)}
/>
```

### CSP / script self-hosted

Por padrão, o pittiquita injeta:

```
https://mcp.figma.com/mcp/html-to-design/capture.js
```

Somente quando `hostname === 'localhost'` **e** o hash da URL contém `figmacapture=`. Se o seu ambiente usa uma Content Security Policy restrita:

```tsx
<FigmaCapturePanel
  scriptSrc="https://your-mirror.example.com/capture.js"
  integrity="sha384-..."
  nonce={yourCspNonce}
  crossOrigin="anonymous"
/>
```

As mesmas opções estão disponíveis em `useFigmaCapture(options)` para uso headless.

---

## Entry points

| Import             | Arquivo fonte        | Use para                                               |
| ------------------ | -------------------- | ------------------------------------------------------ |
| `pittiquita`       | `src/index.ts`       | Components + hooks + utils + types                     |
| `pittiquita/hooks` | `src/hooks.ts`       | Apenas hooks headless (sem bundle de componente React) |
| `pittiquita/vite`  | `src/vite/plugin.ts` | Plugin do Vite                                         |
| `pittiquita/next`  | `src/next/plugin.ts` | Wrapper de config `withPittiquita()` pro Next.js       |

---

## Solução de problemas

### O painel não aparece

- Você precisa estar em `localhost` ou `127.0.0.1`. Domínios `.local` customizados e IPs da rede local (`192.168.x.x`) não vão funcionar — por design.
- Em apps com SSR, o painel começa oculto e aparece após a hidratação. Se nunca aparecer, verifica se `useLocalOrigin()` retorna `true` no console do navegador.

### Cliquei em Activate e nada aconteceu no Figma

1. O hash da URL deve ter mudado para `#figmacapture=manual`.
2. Um `<script data-figma-capture-loader>` deve estar no `<head>` — confere no painel de Elements.
3. O plugin **HTML to Design** precisa estar aberto no Figma com o modo **"Import from URL"** selecionado.
4. Cola a URL completa (com o hash) no campo do plugin.

### O CSP bloqueou o script

Usa `nonce` (ou `integrity`). Exemplo com Next.js App Router:

```tsx
import { headers } from "next/headers";
import { FigmaCapturePanel } from "pittiquita";

export default async function Layout({ children }) {
  const nonce = (await headers()).get("x-csp-nonce") ?? undefined;
  return (
    <html>
      <body>
        {children}
        <FigmaCapturePanel nonce={nonce} />
      </body>
    </html>
  );
}
```

### As regiões não atualizam na navegação (SPA)

O pittiquita escuta `popstate` e `hashchange` automaticamente. Para roteadores que atualizam apenas o estado interno (Next.js App Router, TanStack Router), passa o pathname atual:

```tsx
"use client";
import { usePathname } from "next/navigation";
import { FigmaCapturePanel } from "pittiquita";

export function DevPanel() {
  return <FigmaCapturePanel pathname={usePathname()} />;
}
```

---

## FAQ

**É seguro subir o import pra produção?**

Sim. O componente retorna `null` fora do `localhost`. Pra ter ainda mais certeza, envolve em `process.env.NODE_ENV === 'development'` — os bundlers vão eliminar o branch morto completamente.

**Funciona com React Server Components?**

`<FigmaCapturePanel>` usa hooks internamente, então precisa ser um Client Component. Adiciona `'use client'` no arquivo que o importa, ou cria um wrapper fino com essa diretiva.

**Posso usar com Tailwind / styled-components / CSS Modules?**

Sim. Usa os slots de `classNames` pra injetar suas próprias classes e mantém `theme` para os tokens de CSS variable.

**Algum dado é enviado para servidores externos?**

Nada vindo do `pittiquita` em si. Quando você ativa a captura, o script do Figma (`mcp.figma.com`) cuida da leitura do DOM de acordo com a [política de privacidade](https://www.figma.com/legal/privacy/) do próprio Figma.

**Funciona com design tokens / CSS variables que já tenho no projeto?**

Sim. A prop `theme` mapeia os tokens internos do pittiquita para variáveis CSS `--pittiquita-*`. Seus tokens de design system existentes não são tocados.

---

## Desenvolvimento

```bash
pnpm install
pnpm test:run       # roda todos os 58 testes de uma vez (Vitest)
pnpm typecheck      # tsc --noEmit
pnpm build          # tsup → dist/ (ESM + CJS + .d.ts)
pnpm dev            # tsup --watch

# playground interativo (app Vite linkado ao pacote local)
# build the library first, then:
cd playground && pnpm install && pnpm dev
```

Rodando um arquivo de teste específico:

```bash
pnpm vitest run tests/core/utils/regions.test.ts
```

**Stack:** TypeScript 6 · React 18/19 · Vite 8 · Vitest 4 · tsup 8 · pnpm

### Visão geral da arquitetura

```
src/
├── core/              # TypeScript puro — zero dependência do React
│   ├── utils/         # capture, regions, file-ref, labels
│   ├── hooks/         # useFigmaCapture, useFigmaRegions, useFigmaFileRef, useLocalOrigin
│   └── types.ts       # Todos os tipos compartilhados
├── react/             # Camada de apresentação React
│   ├── FigmaTarget.tsx
│   ├── FigmaCapturePanel.tsx
│   ├── components/    # ActionsRow, FileRefField, HiddenBar, RegionList
│   └── styles.ts      # Estilos inline + sistema de CSS variables
├── vite/plugin.ts     # Plugin do Vite
└── next/plugin.ts     # Wrapper de config para Next.js
```

O core é headless e agnóstico de framework. Nova lógica vai em `core/`. Nova UI vai em `react/`. Mantém essa separação.

### Contribuindo

1. Faz um fork do repositório
2. Cria uma branch: `git checkout -b feat/sua-feature`
3. Adiciona testes para tudo que for novo
4. Roda `pnpm test:run && pnpm typecheck && pnpm build`
5. Abre um PR

---

## Licença & créditos

MIT © [Pedro Nazarito](https://github.com/pedronazarito98)

Batizado em homenagem à Pittiquita — a gata que supervisionou cada commit deste projeto e não teve nenhuma nota a dar. 🐱

> _"Se não fosse ela miando no meu colo enquanto eu escrevia isso, o nome seria algo sem graça tipo `figma-capture-kit`."_
