# pittiquita

> Toolkit React para mandar componentes HTML direto para o Figma — via o plugin oficial [HTML to Design](https://www.figma.com/community/plugin/1159123024924461424).

<p>
  <img alt="npm version" src="https://img.shields.io/npm/v/pittiquita?color=6366f1" />
  <img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/pittiquita?label=min%2Bgzip" />
  <img alt="license" src="https://img.shields.io/npm/l/pittiquita" />
  <img alt="tests" src="https://img.shields.io/badge/tests-58%20passing-brightgreen" />
</p>

`pittiquita` te dá um painelzinho que só aparece em `localhost`, ativa o script oficial da Figma e te deixa selecionar regiões da sua página para importar no Figma como layers prontos para design.

> **Zero overhead em produção.** A checagem `hostname === 'localhost'` acontece antes de qualquer renderização — o componente retorna `null` fora de dev.

---

## Sumário

- [Por que usar](#por-que-usar)
- [Instalação](#instalação)
- [Uso em 30 segundos](#uso-em-30-segundos)
- [Marcando regiões](#marcando-regiões)
- [Hooks (headless)](#hooks-headless)
- [Plugins de build](#plugins-de-build)
- [Customização](#customização)
- [Segurança](#segurança)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Desenvolvimento](#desenvolvimento)

---

## Por que usar

Copiar designs de um app rodando localmente para o Figma normalmente exige:

- abrir DevTools,
- copiar o HTML do elemento,
- colar no plugin HTML to Design,
- torcer para vir o que você queria.

Com `pittiquita` você:

- **Aperta um botão** → o script da Figma é injetado, você cola a URL no plugin, pronto.
- **Marca regiões** com `<FigmaTarget name="hero">` → elas viram botões no painel, clica e rola até o elemento.
- **Não polui o bundle de produção** — entry-points separados, `sideEffects: false`, tree-shake-friendly.

## Instalação

```bash
pnpm add pittiquita
# ou
npm i pittiquita
# ou
yarn add pittiquita
```

Peer deps: `react >=18` e `react-dom >=18` (testado também em React 19).

## Uso em 30 segundos

```tsx
// app/layout.tsx (Next.js) ou src/main.tsx (Vite/CRA)
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

Rode `pnpm dev`, abra em `http://localhost:xxxx` e o painel aparece no canto da tela. Aperta **Activate capture**, copia a URL do browser, cola no plugin HTML to Design dentro do Figma. Fim.

## Marcando regiões

Quer que uma seção específica vire um "botão de atalho" no painel? Use uma das duas formas:

### Componente wrapper

```tsx
import { FigmaTarget } from "pittiquita";

<FigmaTarget name="hero-section" label="Hero">
  <section>...</section>
</FigmaTarget>;
```

### Spread (sem wrapper extra)

```tsx
import { figmaTarget } from "pittiquita";

<section {...figmaTarget("hero-section", { label: "Hero" })}>...</section>;
```

As regiões marcadas viram uma grade de botões no painel. Clicar em um botão faz scroll-into-view e destaca o elemento no DOM via `data-figma-selected`.

## Hooks (headless)

Se você não quer o painel pronto e prefere montar a sua própria UI:

```tsx
import {
  useFigmaCapture,
  useFigmaRegions,
  useFigmaFileRef,
  useLocalOrigin,
} from "pittiquita/hooks";

function MyPanel() {
  const isLocal = useLocalOrigin();
  const { activate } = useFigmaCapture();
  const { regions, refresh } = useFigmaRegions();
  const { value, setValue, openExistingFile } = useFigmaFileRef();

  if (!isLocal) return null;
  // ...sua UI aqui
}
```

Todos os hooks são SSR-safe e só fazem trabalho real no client em `localhost`.

## Plugins de build

### Vite

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { pittiquita } from "pittiquita/vite";

export default defineConfig({
  plugins: [react(), pittiquita()],
});
```

O plugin injeta o painel automaticamente em `dev` (só com `apply: 'serve'`) — nada é adicionado ao bundle de produção.

### Next.js

Para App Router, basta importar o componente no layout. Como o Next roda em Node no server, o `<FigmaCapturePanel>` se vira sozinho (checagem de `window`).

```tsx
// app/layout.tsx
import { FigmaCapturePanel } from "pittiquita";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        {process.env.NODE_ENV === "development" && <FigmaCapturePanel />}
      </body>
    </html>
  );
}
```

## Customização

### Tema (CSS variables)

```tsx
<FigmaCapturePanel
  theme={{
    accentColor: "#8b5cf6",
    panelBg: "#1a1a2e",
    textPrimary: "#f8fafc",
  }}
/>
```

Tokens disponíveis: `panelBg`, `borderColor`, `borderRadius`, `accentColor`, `textPrimary`, `textSecondary`, `textMuted`, `fontFamily`, `fontSize`, `gap`, `padding`, `zIndex`.

### Labels (i18n)

```tsx
<FigmaCapturePanel
  labels={{
    panelTitle: "Capturar para Figma",
    activateCapture: "Ativar",
    reset: "Limpar",
    regionsTitle: "Regiões marcadas",
  }}
/>
```

Override parcial — o que não for passado herda os defaults em inglês.

### Classes (Tailwind-ready)

```tsx
<FigmaCapturePanel
  classNames={{
    header: "border-b pb-2",
    actions: "gap-3",
    regionList: "max-h-80",
  }}
/>
```

### Posição do painel

```tsx
<FigmaCapturePanel position="top-left" />
// 'bottom-right' (default) | 'bottom-left' | 'top-right' | 'top-left'
```

### Callbacks

```tsx
<FigmaCapturePanel
  onCaptureActivate={() => console.log("captura ativada")}
  onRegionSelect={(region) => console.log("selecionou", region.label)}
/>
```

## Segurança

Em dev, `pittiquita` injeta o script oficial da Figma:

```
https://mcp.figma.com/mcp/html-to-design/capture.js
```

**Ele só é injetado quando ambas as condições são verdadeiras:**

1. `window.location.hostname` é `localhost` ou `127.0.0.1`.
2. O hash da URL contém `figmacapture=` (ativado manualmente ou pelo botão do painel).

Se você precisa self-host, mirror ou fixar a versão do script (ex.: ambiente com CSP estrita), use os props:

```tsx
<FigmaCapturePanel
  scriptSrc="https://seu-mirror.exemplo.com/html-to-design/capture.js"
  integrity="sha384-..."
  nonce={cspNonce}
  crossOrigin="anonymous"
/>
```

Os mesmos parâmetros existem em `useFigmaCapture(options)` e `ensureCaptureScript(options)`.

## Troubleshooting

### "O painel não aparece"

- Está rodando em `localhost` ou `127.0.0.1`? Domínios tipo `app.local` ou IP da LAN (`192.168.x.x`) não disparam o painel de propósito.
- Em SSR, o painel começa invisível e renderiza após hidratação. Se ficar invisível para sempre, verifique se `useLocalOrigin()` retorna `true` no client.

### "Apertei Activate mas não aconteceu nada no Figma"

1. O hash da URL deve ter mudado para `#figmacapture=manual`.
2. Um `<script data-figma-capture-loader>` deve ter sido injetado no `<head>`.
3. Dentro do Figma, o plugin **HTML to Design** precisa estar aberto com o modo "Import from URL".
4. Cole a URL do navegador (com o hash) no campo do plugin.

### "CSP bloqueou o script"

Use `nonce` ou `integrity`. Exemplo Next.js:

```tsx
import { headers } from 'next/headers'

const nonce = headers().get('x-csp-nonce') ?? undefined
<FigmaCapturePanel nonce={nonce} />
```

### "As regiões não atualizam quando mudo de página (SPA)"

A lib escuta `popstate` e `hashchange` automaticamente. Para roteadores que só alteram state interno (Next App Router, TanStack Router), passe o `pathname`:

```tsx
"use client";
import { usePathname } from "next/navigation";

<FigmaCapturePanel pathname={usePathname()} />;
```

## FAQ

**É seguro deixar o import em produção?**
Sim. O componente retorna `null` fora de `localhost` e o bundle é tree-shakeable. Ainda assim, para garantia total, envolva em `process.env.NODE_ENV === 'development'`.

**Funciona com React Server Components?**
O `<FigmaCapturePanel>` usa hooks, então marque o arquivo com `'use client'`.

**Dá pra usar com Tailwind/styled-components/etc?**
Dá. Use `classNames` para sobrescrever slots e mantenha o `theme` para os tokens básicos.

**Existe algum dado sendo enviado para servidor externo?**
Pelo `pittiquita`, não. Pelo script da Figma (quando ativado em dev), os dados do DOM vão para o Figma conforme o plugin HTML to Design — leia a [política deles](https://www.figma.com/legal/privacy/).

## Desenvolvimento

```bash
pnpm install
pnpm run test:run   # roda os 58 testes
pnpm run typecheck  # tsc --noEmit
pnpm run build      # gera dist/

# playground interativo
cd playground && pnpm install && pnpm dev
```

Stack: TypeScript 6, Vite 8, Vitest 4, tsup 8, React 19.

## Licença

MIT © Pedro Nazarito
