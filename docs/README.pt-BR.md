<div align="center">
  <img src="https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/logo.svg" width="132" alt="Mascote gatinho do pittiquita dormindo" />
  <h1>pittiquita</h1>
  <p>
    <strong>Capture estados reais de interfaces React no localhost e leve-os ao Figma pelo HTML to Design.</strong>
  </p>
  <p>
    Uma pequena ferramenta de desenvolvimento com guards de navegador conscientes de SSR, para engenheiros e designers que precisam continuar o ciclo de design a partir do produto renderizado — não de uma captura de tela.
  </p>
  <p>
    <a href="https://www.npmjs.com/package/pittiquita"><img alt="versão no npm" src="https://img.shields.io/npm/v/pittiquita?color=6366f1&style=flat-square" /></a>
    <a href="https://www.npmjs.com/package/pittiquita"><img alt="downloads no npm" src="https://img.shields.io/npm/dm/pittiquita?color=0ea5e9&style=flat-square" /></a>
    <a href="https://bundlephobia.com/package/pittiquita"><img alt="bundle minificado e compactado com gzip" src="https://img.shields.io/bundlephobia/minzip/pittiquita?label=min%2Bgzip&color=22c55e&style=flat-square" /></a>
    <a href="https://github.com/pedronazarito98/pittiquita/actions/workflows/ci.yml"><img alt="status da CI" src="https://github.com/pedronazarito98/pittiquita/actions/workflows/ci.yml/badge.svg" /></a>
    <a href="https://github.com/pedronazarito98/pittiquita/blob/main/LICENSE"><img alt="licença MIT" src="https://img.shields.io/npm/l/pittiquita?color=111827&style=flat-square" /></a>
  </p>
  <p>
    <a href="../README.md">English</a>
    ·
    Português
  </p>
  <p>
    <a href="#demonstração">Demonstração</a>
    ·
    <a href="#instalação">Instalação</a>
    ·
    <a href="./guides/README.md">Guias</a>
    ·
    <a href="./architecture/overview.md">Arquitetura</a>
    ·
    <a href="../SECURITY.md">Segurança</a>
  </p>
</div>

---

## Visão rápida

O `pittiquita` adiciona um painel de captura a uma aplicação React local. Ele descobre regiões nomeadas, ativa o hash de captura e carrega o script externo do HTML to Design. Depois, você copia a URL no navegador e a cola no plugin independente [HTML to Design](https://www.figma.com/community/plugin/1159123024924461424/html-to-design) para Figma.

```text
Aplicação React no localhost
  → painel ou hooks headless do pittiquita
  → #figmacapture=manual + script de captura
  → copiar a URL do navegador
  → HTML to Design
  → camadas editáveis no Figma
```

| Feito para | Como ajuda |
| --- | --- |
| Revisões de UI implementada | Usa o estado que o navegador realmente renderizou: props, CSS, dados, layout e o estado visual da interação naquele momento. |
| Ciclos design-código-design | Torna explícito e repetível o caminho de volta de uma tela React funcional para o Figma. |
| Páginas densas | Permite nomear regiões úteis e navegar até elas pelo painel. |
| Ambientes de desenvolvimento | Não mostra a UI de captura fora de `localhost` e `127.0.0.1`; a integração Vite funciona somente no servidor de desenvolvimento. |

> [!IMPORTANT]
> O `pittiquita` é uma ferramenta de desenvolvimento independente. Ele não é afiliado, endossado nem um produto oficial do Figma. A importação final é feita pelo plugin separado HTML to Design.

## Demonstração

O walkthrough versionado mostra o painel local real e uma etapa final de handoff explicitamente ilustrativa.

![Fluxo animado do pittiquita, do playground local ao handoff ilustrativo no HTML to Design](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/pittiquita-flow.gif)

> A animação é gerada a partir do playground local. A tela final do Figma é um mock local explicitamente identificado, não uma importação gravada.

| Painel no localhost | Modo de captura ativo |
| --- | --- |
| ![painel do pittiquita rodando no playground local](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/01-localhost-panel.png) | ![pittiquita depois de ativar o hash de captura](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/02-capture-active.png) |

| URL do navegador pronta para copiar | Etapa ilustrativa no HTML to Design |
| --- | --- |
| ![URL do navegador com o hash de captura do pittiquita](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/03-copy-url.png) | ![mock local ilustrando onde colar a URL no HTML to Design](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/04-figma-import-step.png) |

A quarta imagem é um mock local, não uma evidência de importação real no Figma. Assim, a demo é reproduzível sem login. Veja as [notas da demonstração](./demo/README.md) para o comando de geração e esse limite.

## O problema

A UI no arquivo de design e a UI executada no produto naturalmente se afastam. Quando a implementação começa, o navegador passa a ser o único lugar onde props, CSS real, dados atuais, restrições de layout e estados transitórios coexistem.

Os atalhos mais comuns perdem informações úteis:

| Alternativa | Limitação |
| --- | --- |
| Screenshot | Preserva pixels, mas não uma estrutura editável. |
| Copiar HTML manualmente | Exige inspeção do DOM e é fácil repetir o processo de forma inconsistente. |
| Remontar o estado no Figma | Duplica trabalho e pode perder decisões da implementação. |
| Compartilhar somente o código-fonte | Não comunica o estado exato renderizado pelo navegador. |

## O que o pittiquita faz

- Renderiza um painel compacto de captura em uma árvore React local.
- Ativa `#figmacapture=manual` sem substituir um hash de captura já existente.
- Carrega o script de captura do HTML to Design somente quando o modo está ativo em um hostname local aceito.
- Descobre elementos visíveis marcados com `data-figma-target` ou com o atributo compatível `data-debug-layer`.
- Rola até uma região nomeada e a marca com `data-figma-selected`, permitindo que a aplicação hospedeira estilize a seleção se desejar.
- Expõe hooks headless para times que precisam de uma UI própria.
- Oferece um plugin Vite restrito a `serve`, que monta o painel automaticamente.
- Publica ESM, CommonJS e declarações TypeScript em quatro entry points públicos.

## Para quem ele foi criado

- Engenheiros frontend revisando interfaces implementadas com designers de produto.
- Times de design system comparando estados reais de componentes com os designs de origem.
- Engenheiros de produto levando um dashboard, formulário ou fluxo local de volta ao Figma para iterar.
- Times pequenos que querem esse handoff sem operar outro backend ou sistema de contas.

## Por que eu criei este projeto

Criei o `pittiquita` para o momento em que “o design” deixa de existir somente no Figma. A tela implementada agora contém decisões codificadas em props, CSS responsivo, dados realistas, estados de loading e erro e no próprio layout do navegador. Screenshots achatam essas decisões; copiar HTML manualmente transforma cada iteração em uma tarefa frágil no DevTools.

O objetivo é intencionalmente específico: oferecer a designers e engenheiros um caminho curto de um estado React local e vivo de volta a um fluxo de design editável, mantendo o helper visível, inspecionável e limitado a hosts de desenvolvimento.

## Como funciona

1. Rode a aplicação React em `localhost` ou `127.0.0.1`.
2. Monte `FigmaCapturePanel` ou use o plugin Vite/hooks headless.
3. Opcionalmente, marque regiões úteis com `FigmaTarget` ou `figmaTarget()`.
4. Escolha **Activate capture**. O `pittiquita` adiciona `#figmacapture=manual` e inclui o script externo de captura na página.
5. Copie a URL completa no navegador.
6. Abra o HTML to Design no Figma e use o fluxo de importação por URL.

A página no navegador continua sendo a fonte do estado capturado. O `pittiquita` não opera proxy, serviço de upload nem backend para a API do Figma.

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

Instalar como dependência de desenvolvimento comunica o uso esperado. Se o build de produção ainda resolver código que importa o pacote, a exclusão do bundle dependerá da sua integração e do bundler.

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

Abra a aplicação em `localhost` ou `127.0.0.1`. Nos demais hostnames, o componente retorna `null` após a verificação no cliente.

Para uma configuração consciente de produção, use também o guard de ambiente oferecido pelo seu framework, evitando montar o painel em produção. A checagem de localhost impede que a UI apareça; sozinha, ela não garante que todos os bundlers removam os bytes do pacote.

## Configuração React

O painel pronto permite alterar posição, parte do tema/textos, callbacks e atributos de segurança do script:

```tsx
import { FigmaCapturePanel } from 'pittiquita'

export function DevelopmentTools() {
  return (
    <FigmaCapturePanel
      position="bottom-left"
      labels={{ panelTitle: 'Handoff de design' }}
      onRegionSelect={(region) => console.info(region.id)}
    />
  )
}
```

Veja o [guia React](./guides/react.md) para temas, textos, callbacks e guards de desenvolvimento.

## Vite

O plugin Vite dedicado monta o painel durante `vite dev`:

```ts
// vite.config.ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { pittiquita } from 'pittiquita/vite'

export default defineConfig({
  plugins: [react(), pittiquita()],
})
```

O plugin declara `apply: 'serve'`, então não injeta o módulo virtual durante `vite build`. As opções precisam ser serializáveis; monte `FigmaCapturePanel` manualmente quando precisar de props que sejam funções, como callbacks.

Veja o [guia Vite](./guides/vite.md).

## Next.js App Router

Use um Client Component. Esta é a integração recomendada e explícita:

```tsx
// app/pittiquita-panel.tsx
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
import { PittiquitaPanel } from './pittiquita-panel'

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

O entry point `pittiquita/next` atual exporta `withPittiquita`, mas esse helper de configuração **não** monta o painel React. Não dependa dele para injeção automática de UI. O Client Component acima é o caminho documentado, e ainda não existe um teste de integração dedicado ao Next.js.

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

As duas APIs emitem `data-figma-target` e `data-figma-label`. A descoberta observa mudanças no DOM e ignora qualquer conteúdo dentro de `data-figma-helper`.

## Hooks headless

Crie sua própria toolbar com `pittiquita/hooks`:

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

O entry point de hooks também exporta helpers de referência de arquivo, textos, utilitários de captura e tipos públicos. Veja [Regiões e hooks headless](./guides/targets-and-hooks.md).

## Entry points públicos

O manifesto expõe exatamente quatro entry points, todos compilados como ESM e CommonJS e com declarações:

| Import | Finalidade |
| --- | --- |
| `pittiquita` | Componentes React, hooks, utilitários e tipos públicos. |
| `pittiquita/hooks` | Hooks headless, utilitários de apoio e tipos dos hooks. |
| `pittiquita/vite` | Plugin Vite somente para `serve`, com montagem automática do painel. |
| `pittiquita/next` | Wrapper de configuração Next em desenvolvimento; não monta UI. |

## Arquitetura

O código é separado por responsabilidade:

| Área | Responsabilidade |
| --- | --- |
| `src/core/` | Guards do navegador, estado de captura, descoberta de regiões, referência de arquivo e tipos compartilhados. |
| `src/react/` | `FigmaCapturePanel`, `FigmaTarget`, pequenos componentes de UI e estilos inline. |
| `src/vite/` | Módulo virtual do Vite e injeção apenas durante `serve`. |
| `src/next/` | Wrapper de configuração do Next.js; sem injeção de componente. |
| `playground/` | Aplicação Vite ligada ao pacote pai para validação manual/demo. |
| `tests/` | Testes Vitest/jsdom que espelham core e React. |
| `scripts/` | Automação reproduzível da demonstração visual. |
| `docs/demo/` | Evidências PNG, GIF e WebM versionadas e documentação honesta do handoff. |

Leia a [visão de arquitetura e limites de confiança](./architecture/overview.md).

## Segurança e privacidade

- O `pittiquita` não possui backend, conta, analytics ou serviço de telemetria.
- Importar o pacote não causa intencionalmente uma requisição de rede.
- O script de captura só é incluído depois que o modo está ativo e o hostname é exatamente `localhost` ou `127.0.0.1`.
- Por padrão, o script vem de `https://mcp.figma.com/mcp/html-to-design/capture.js` e executa dentro da página. Trate isso como um limite de confiança de terceiros: ele pode inspecionar o DOM renderizado.
- `scriptSrc`, `nonce`, `integrity` e `crossOrigin` estão disponíveis para times com mirror controlado ou Content Security Policy estrita.
- A referência opcional de arquivo Figma fica no `localStorage` do navegador; o pittiquita não faz upload dela, e a ação de reset do painel não remove o valor persistido.
- A checagem de host local é um guard de produto, não autenticação nem sandbox de segurança.

Use dados sintéticos ou sanitizados. Não capture segredos de produção, dados pessoais, tokens de acesso ou conteúdo confidencial de clientes. Leia [SECURITY.md](../SECURITY.md) antes de ativar o script externo em uma aplicação sensível.

## O que o pittiquita não é

O `pittiquita`:

- não substitui Storybook, design tokens, uma biblioteca de componentes ou um design system;
- não substitui componentes e variantes nativos do Figma;
- não é um plugin do Figma nem uma integração oficial;
- não autentica com o Figma nem gerencia arquivos;
- não recria código-fonte React, lógica de estado, eventos ou comportamento da aplicação dentro do Figma;
- não garante conversão pixel-perfect — o plugin independente HTML to Design controla esse resultado;
- não deve ser usado para expor estados sensíveis de produção.

## Compatibilidade e evidências

Os rótulos distinguem o que é testado do que é declarado ou apenas documentado:

- **Baseline testado**: exercitado pela suíte automatizada ou build deste repositório.
- **Implementado**: presente no código/configuração, sem uma matriz de integração dedicada.
- **Caminho documentado**: uso esperado da API pública, ainda sem teste end-to-end do framework.

| Ambiente | Nível de evidência | Limite atual |
| --- | --- | --- |
| React 18 | Suporte declarado | Os peers `react` e `react-dom` são `>=18.0.0`; a suíte atual roda React 19, sem job separado para React 18. |
| React 19 | Baseline testado | Desenvolvimento e testes usam React `^19.2.5`. |
| Vite | Implementado | Plugin `pittiquita/vite` configurado no playground; a injeção de produção é desativada com `apply: 'serve'`, mas a montagem automática não possui teste de integração isolado. |
| Next.js App Router | Caminho documentado | Monte manualmente um Client Component; não há teste de integração automatizado. |
| SSR | Guards implementados | O acesso ao navegador é adiado/protegido, mas ainda não há matriz SSR por framework. |
| Origens não locais | Guard de runtime testado | O painel não renderiza UI. Isso não prova remoção de bytes do bundle. |
| ESM e CommonJS | Build testado | O `tsup` gera os dois formatos e declarações para todos os entry points. |
| `localhost`, `127.0.0.1` | Baseline testado | São os únicos hostnames aceitos. IPv6 `::1` e domínios locais customizados não são aceitos. |

## Limitações conhecidas

- A captura por URL depende do script externo do HTML to Design e do plugin separado para Figma.
- O hash de captura substitui um hash anterior que não seja de captura na primeira ativação.
- Hostnames customizados, IPs da rede local, domínios HTTPS de preview e loopback IPv6 estão fora da allowlist atual.
- Shadow DOM, iframes cross-origin, canvas, vídeos, animações complexas e assets exclusivos do navegador podem exigir validação manual após a importação.
- A descoberta lista apenas elementos visíveis que correspondam aos seletores no documento principal.
- `FigmaTarget` e `figmaTarget()` ainda emitem wrapper/atributos onde forem renderizados pelo consumidor, inclusive em produção.
- O painel orienta o usuário a copiar a URL do navegador; ainda não existe botão de copiar para o clipboard.
- A remoção no build para uso manual em React/Next depende do guard de ambiente e do bundler do consumidor.
- React 18 e Next.js ainda não possuem jobs dedicados na matriz de CI deste repositório.

## Qualidade do projeto

O baseline atual é verificável:

| Evidência | Baseline atual | Como verificar |
| --- | --- | --- |
| Versão do pacote | `0.1.7` | `package.json` ou badge dinâmico do npm. |
| Entry points públicos | 4 | Inspecione `package.json#exports` e `tsup.config.ts`. |
| Testes automatizados | 82 testes em 11 arquivos no baseline integrado da demo reproduzível | Rode `pnpm test:run`. Antes dos testes da demo, o baseline verificado era 58 em 9 arquivos. |
| Tipos/build | ESM, CommonJS e declarações | Rode `pnpm typecheck` e `pnpm build`. |
| Conteúdo do pacote | Inspeção do tarball em dry-run | Rode `pnpm pack:check`; os tamanhos não são fixados aqui. |
| Integração contínua | lint, testes, validação dos artefatos da demo, typecheck, build e pack dry-run | Consulte `.github/workflows/ci.yml` ou o badge. |

## Como contribuir

Contribuições são bem-vindas quando preservam o limite de desenvolvimento e a estabilidade da API pública. Comece por [CONTRIBUTING.md](../CONTRIBUTING.md), siga o [Código de Conduta](../CODE_OF_CONDUCT.md) e use os templates de issue/PR.

```bash
pnpm install --frozen-lockfile
pnpm validate
pnpm pack:check
pnpm --dir playground build
```

Mudanças na automação ou mídia da demo também exigem `pnpm demo:check` e o fluxo documentado em `docs/demo/`.

Problemas de segurança devem seguir o processo privado em [SECURITY.md](../SECURITY.md), nunca uma issue pública.

## Direção do roadmap

Estas são direções, não datas prometidas:

- Adicionar matrizes automatizadas explícitas para React 18 e um fixture de Next.js App Router.
- Melhorar a navegação entre regiões em páginas densas.
- Tornar o handoff da URL mais direto sem esconder permissões do navegador.
- Expandir exemplos para design systems e monorepos.

Acompanhe trabalho aceito nas [GitHub Issues](https://github.com/pedronazarito98/pittiquita/issues); não trate esta lista como promessa de compatibilidade.

## Licença

[MIT](../LICENSE) © Pedro Nazarito.
