<div align="center">
  <img src="https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/logo.svg" width="132" alt="Mascote gatinho do pittiquita dormindo" />
  <h1>pittiquita</h1>
  <p>
    <strong>Capture estados reais de interfaces React no localhost e leve-os ao Figma pelo HTML to Design.</strong>
  </p>
  <p>
    Uma ferramenta de desenvolvimento focada em engenheiros e designers que precisam continuar o ciclo de design a partir do produto renderizado — não de uma captura de tela.
  </p>
  <p>
    <a href="https://www.npmjs.com/package/pittiquita"><img alt="versão no npm" src="https://img.shields.io/npm/v/pittiquita?color=6366f1&style=flat-square" /></a>
    <a href="https://www.npmjs.com/package/pittiquita"><img alt="downloads no npm" src="https://img.shields.io/npm/dm/pittiquita?color=0ea5e9&style=flat-square" /></a>
    <a href="https://bundlephobia.com/package/pittiquita"><img alt="bundle minificado e compactado com gzip" src="https://img.shields.io/bundlephobia/minzip/pittiquita?label=min%2Bgzip&color=22c55e&style=flat-square" /></a>
    <a href="https://github.com/pedronazarito98/pittiquita/actions/workflows/ci.yml"><img alt="status da CI" src="https://github.com/pedronazarito98/pittiquita/actions/workflows/ci.yml/badge.svg" /></a>
    <a href="https://github.com/pedronazarito98/pittiquita/blob/main/LICENSE"><img alt="licença MIT" src="https://img.shields.io/npm/l/pittiquita?color=111827&style=flat-square" /></a>
  </p>
  <p>
    <a href="../README.md">English</a> · Português
  </p>
  <p>
    <a href="#demonstração">Demonstração</a> ·
    <a href="#instalação">Instalação</a> ·
    <a href="./guides/README.md">Guias</a> ·
    <a href="./architecture/overview.md">Arquitetura</a> ·
    <a href="../SECURITY.md">Segurança</a>
  </p>
</div>

---

## Visão rápida

O `pittiquita` adiciona um painel de captura a uma aplicação React local. Ele descobre regiões nomeadas, ativa o hash de captura, carrega o script externo do HTML to Design e prepara a URL do navegador para o plugin independente HTML to Design no Figma.

```text
Aplicação React no localhost
  → painel, adaptador de framework ou hooks headless do pittiquita
  → #figmacapture=manual + script de captura
  → copiar a URL do navegador
  → HTML to Design
  → camadas editáveis no Figma
```

| Feito para | Como ajuda |
| --- | --- |
| Revisões de UI implementada | Usa o estado que o navegador realmente renderizou: props, CSS, dados, layout e estado visual da interação. |
| Ciclos design-código-design | Torna explícito e repetível o caminho de volta de uma tela React funcional para o Figma. |
| Páginas densas | Permite nomear regiões úteis e navegar até elas pelo painel. |
| Desenvolvimento local | Oculta a UI fora de `localhost` e `127.0.0.1`; o adaptador Vite funciona somente em `serve`. |

> [!IMPORTANT]
> O `pittiquita` é uma ferramenta independente. Ele não é afiliado, endossado nem um produto oficial do Figma. A importação final é feita pelo plugin separado HTML to Design.

## Demonstração

O walkthrough versionado mostra o painel local real e uma etapa final de handoff explicitamente ilustrativa.

![Fluxo animado do pittiquita, do playground local ao handoff ilustrativo no HTML to Design](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/pittiquita-flow.gif)

> A animação é gerada pelo playground local. A tela final do Figma é um mock local identificado, não uma importação real gravada.

| Painel no localhost | Modo de captura ativo |
| --- | --- |
| ![painel do pittiquita no playground local](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/01-localhost-panel.png) | ![pittiquita depois de ativar o hash de captura](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/02-capture-active.png) |

| URL pronta para copiar | Etapa ilustrativa no HTML to Design |
| --- | --- |
| ![URL com o hash de captura do pittiquita](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/03-copy-url.png) | ![mock local ilustrando onde colar a URL no HTML to Design](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/04-figma-import-step.png) |

Veja as [notas da demonstração](./demo/README.md) para geração, validação, limites de mídia e a separação entre evidência real e mock.

## Por que ele existe

Quando a implementação começa, o navegador passa a ser o único lugar onde props, CSS real, dados realistas, restrições responsivas, estados de loading, erros e interações coexistem.

Os atalhos mais comuns perdem informações úteis:

| Alternativa | Limitação |
| --- | --- |
| Screenshot | Preserva pixels, mas não uma estrutura editável. |
| Copiar HTML manualmente | Exige inspeção do DOM e é fácil repetir o processo de forma inconsistente. |
| Remontar o estado no Figma | Duplica trabalho e pode perder decisões da implementação. |
| Compartilhar somente o código | Não comunica o estado exato renderizado. |

O escopo do `pittiquita` é intencionalmente específico: preparar um estado React local e vivo para um handoff editável sem operar backend, proxy, sistema de contas ou integração com a API do Figma.

## O que ele faz

- Renderiza um painel de captura acessível em uma árvore React local.
- Ativa `#figmacapture=manual` sem duplicar um token de captura existente.
- Carrega o script do HTML to Design somente quando o modo está ativo em um hostname local aceito.
- Descobre elementos visíveis marcados com `data-figma-target` ou com o atributo legado `data-debug-layer`.
- Rola até regiões nomeadas e expõe a seleção por `data-figma-selected`.
- Oferece hooks headless para interfaces personalizadas.
- Oferece um plugin Vite restrito a `serve`, com montagem automática segura durante HMR.
- Oferece um Client Component sensível à rota para Next.js App Router.
- Publica ESM, CommonJS e declarações TypeScript em quatro entry points públicos.

## Instalação

React 18 ou mais recente e React DOM 18 ou mais recente são peer dependencies.

```bash
pnpm add -D pittiquita
```

Comandos equivalentes:

```bash
npm install --save-dev pittiquita
yarn add --dev pittiquita
```

Instalar como dependência de desenvolvimento comunica o uso esperado. Guards de runtime não garantem universalmente a remoção dos bytes do bundle; use também a fronteira de ambiente oferecida pela aplicação ou framework.

## Uso rápido com React

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

Abra a aplicação em `localhost` ou `127.0.0.1`. Nos demais hostnames, o painel retorna `null` depois da verificação no cliente.

O painel permite configurar posição, tema, textos, atributos CSP/SRI, callbacks, teclado, anúncios semânticos de estado e classes por slot:

```tsx
import { FigmaCapturePanel } from 'pittiquita'

export function DevelopmentTools() {
  return (
    <FigmaCapturePanel
      position="bottom-left"
      labels={{
        panelTitle: 'Handoff de design',
        activateCapture: 'Preparar URL',
      }}
      onRegionSelect={(region) => console.info(region.id)}
    />
  )
}
```

Veja o [guia React](./guides/react.md).

## Vite

O plugin Vite dedicado monta o painel somente durante `vite dev`:

```ts
// vite.config.ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { pittiquita } from 'pittiquita/vite'

export default defineConfig({
  plugins: [react(), pittiquita()],
})
```

O plugin declara `apply: 'serve'`, reutiliza a montagem durante o desenvolvimento e faz cleanup no hot-module replacement. As opções precisam ser serializáveis; monte `FigmaCapturePanel` manualmente quando precisar de props que sejam funções, como callbacks.

Veja o [guia Vite](./guides/vite.md).

## Next.js App Router

Use o Client Component sensível à rota exportado por `pittiquita/next`:

```tsx
// app/layout.tsx
import type { ReactNode } from 'react'
import { PittiquitaNextPanel } from 'pittiquita/next'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <PittiquitaNextPanel />
      </body>
    </html>
  )
}
```

`PittiquitaNextPanel` já contém a fronteira de cliente, lê `usePathname()`, atualiza as regiões após navegações do App Router e retorna `null` fora de desenvolvimento por padrão.

`withPittiquita()` continua disponível somente como wrapper de identidade depreciado para migração. Ele nunca montou a interface. Mova integrações existentes para `PittiquitaNextPanel` e remova o wrapper legado do `next.config`.

Veja o [guia de Next.js](./guides/nextjs.md).

## Marcando regiões de captura

Use `FigmaTarget` quando um elemento wrapper for adequado:

```tsx
import { FigmaTarget } from 'pittiquita'

export function Hero() {
  return (
    <FigmaTarget as="section" name="marketing-hero" label="Hero de marketing">
      <h1>UI renderizada do produto</h1>
    </FigmaTarget>
  )
}
```

Use `figmaTarget()` para adicionar atributos a um elemento existente:

```tsx
import { figmaTarget } from 'pittiquita'

export function Pricing() {
  return <section {...figmaTarget('pricing-grid')}>...</section>
}
```

As duas APIs emitem `data-figma-target` e `data-figma-label`. A descoberta observa mudanças no DOM e ignora elementos dentro de `data-figma-helper`.

## Hooks headless

Crie uma interface própria por `pittiquita/hooks`:

```tsx
import {
  useFigmaCapture,
  useFigmaRegions,
  useLocalOrigin,
} from 'pittiquita/hooks'

export function CaptureToolbar() {
  const isLocal = useLocalOrigin()
  const { regions } = useFigmaRegions({ enabled: isLocal })
  const { activate } = useFigmaCapture({ enabled: isLocal })

  if (!isLocal) return null

  return (
    <button type="button" onClick={activate}>
      Capturar {regions.length} regiões
    </button>
  )
}
```

Veja [Regiões e hooks headless](./guides/targets-and-hooks.md).

## Entry points públicos

| Import | Finalidade |
| --- | --- |
| `pittiquita` | Componentes React, hooks, utilitários e tipos públicos. |
| `pittiquita/hooks` | Hooks headless, utilitários de apoio e seus tipos. |
| `pittiquita/vite` | Adaptador Vite restrito a `serve`, com montagem automática segura em HMR. |
| `pittiquita/next` | Componente sensível à rota do App Router e wrapper legado de migração. |

Os quatro entry points são compilados como ESM e CommonJS, com declarações TypeScript.

## Arquitetura

| Área | Responsabilidade |
| --- | --- |
| `src/core/` | Guards de navegador, estado de captura, descoberta de regiões, referências de arquivo e tipos compartilhados. |
| `src/react/` | Painel acessível, APIs de alvo, slots de UI e estilos inline. |
| `src/vite/` | Módulo virtual restrito a `serve` e ciclo de montagem automática. |
| `src/next/` | Adaptador cliente do App Router e export legado de compatibilidade. |
| `playground/` | Consumidor Vite ligado ao pacote para validação no navegador e da demo. |
| `tests/` | Cobertura Vitest/jsdom de unidades e integrações focadas. |
| `scripts/` | Automação reproduzível da demonstração visual. |

Leia a [visão de arquitetura e fronteiras de confiança](./architecture/overview.md).

## Segurança e privacidade

- O pacote não inclui backend, conta, analytics ou telemetria.
- Importar o pacote não possui efeito de rede intencional.
- O script de captura só é adicionado quando o modo está ativo e o hostname é exatamente `localhost` ou `127.0.0.1`.
- O script padrão vem de `https://mcp.figma.com/mcp/html-to-design/capture.js` e executa na página hospedeira. Trate-o como uma fronteira de confiança de terceiros capaz de inspecionar o DOM renderizado.
- `scriptSrc`, `nonce`, `integrity` e `crossOrigin` permitem mirrors controlados e Content Security Policy mais estrita.
- A referência opcional do arquivo Figma fica somente no `localStorage` do navegador.
- A checagem de host local é um guard de produto, não autenticação ou sandbox de segurança.

Use dados sintéticos ou sanitizados. Não capture segredos de produção, dados pessoais, tokens ou conteúdo confidencial de clientes. Leia o [SECURITY.md](../SECURITY.md).

## Compatibilidade e evidências

| Ambiente | Nível de evidência | Limite atual |
| --- | --- | --- |
| React 18 | Suporte declarado | O peer range é `>=18.0.0`; uma CI dedicada ao React 18 ainda é trabalho futuro. |
| React 19 | Baseline testado | Desenvolvimento e testes automatizados usam React 19. |
| Vite | Adaptador testado | Restrição a `serve`, serialização, montagem idempotente e cleanup de HMR possuem cobertura. |
| Next.js App Router | Adaptador testado | O wrapper cliente e o contrato sensível à rota possuem testes; ainda falta um fixture completo do framework. |
| SSR | Guards implementados | O acesso ao navegador é adiado ou protegido; a cobertura em fixtures de framework ainda é limitada. |
| Origens não locais | Guard de runtime testado | O painel não renderiza. Isso não prova remoção dos bytes do bundle. |
| ESM e CommonJS | Build validado | Todos os entry points produzem os dois formatos e declarações. |
| `localhost`, `127.0.0.1` | Baseline testado | Loopback IPv6, IPs da rede local e domínios locais customizados não são aceitos. |

## Limitações conhecidas

- A captura depende do script externo do HTML to Design e do plugin separado no Figma.
- A primeira ativação substitui um hash anterior que não seja de captura.
- A descoberta cobre elementos visíveis do documento principal, não Shadow DOM ou iframes cross-origin.
- Canvas, vídeo, animações complexas e recursos exclusivos do navegador podem exigir validação manual depois da importação.
- `FigmaTarget` e `figmaTarget()` emitem markup sempre que o consumidor os renderiza, inclusive em produção.
- O painel pede que o usuário copie a URL; ainda não oferece uma ação de clipboard.
- A exclusão do bundle em integrações React e Next.js manuais depende do guard de ambiente e bundler do consumidor.

## Qualidade do projeto

Execute os mesmos gates usados pelo repositório:

```bash
pnpm install --frozen-lockfile
pnpm validate
pnpm pack:check
pnpm --dir playground install --frozen-lockfile
pnpm --dir playground build
pnpm demo:check
```

O repositório inclui testes automatizados, inspeção do pacote, playground consumidor, mídia de demo reproduzível, políticas de contribuição e segurança e documentação bilíngue. As contagens não ficam fixas no README; o resultado da CI é a fonte da verdade.

## Contribuindo

Comece pelo [CONTRIBUTING.md](../CONTRIBUTING.md), siga o [Código de Conduta](../CODE_OF_CONDUCT.md) e use os templates de issues e pull requests.

Achados de segurança devem seguir o processo privado do [SECURITY.md](../SECURITY.md), nunca uma issue pública.

## Direção do roadmap

- Adicionar fixtures completas para React 18 e Next.js App Router.
- Melhorar a navegação entre regiões em páginas densas.
- Tornar o handoff da URL mais direto, mantendo permissões explícitas do navegador.
- Expandir exemplos para design systems e monorepos.

Essas são direções, não datas comprometidas. Acompanhe trabalho aceito nas [GitHub Issues](https://github.com/pedronazarito98/pittiquita/issues).

## Licença

[MIT](../LICENSE) © Pedro Nazarito.
