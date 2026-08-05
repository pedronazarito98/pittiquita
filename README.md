# pittiquita

Eu criei o `pittiquita` para aproximar o produto implementado do trabalho de design. Ele captura estados reais de uma interface React rodando em `localhost` e prepara o fluxo para levar essa tela ao Figma pelo plugin independente HTML to Design.

![Playground do pittiquita com captura ativa e a região Hero selecionada](https://raw.githubusercontent.com/pedronazarito98/pittiquita/main/docs/demo/readme-capture-hero.png)

> A imagem mostra o playground local e o painel de captura em funcionamento. O `pittiquita` não é um produto oficial do Figma e não realiza a importação autenticada por conta própria.

## O problema que eu quis resolver

Durante a implementação, a tela renderizada no navegador concentra informações que uma captura estática não preserva: props, CSS, dados, layout, responsividade e estado de interação.

O `pittiquita` cria uma ponte curta entre esses dois momentos:

```text
React no localhost
  → painel de captura e regiões nomeadas
  → #figmacapture=manual
  → URL do navegador
  → HTML to Design
  → camadas editáveis no Figma
```

## O que ele faz

- renderiza um painel acessível somente em origens locais aceitas;
- descobre regiões marcadas com `data-figma-target`;
- permite selecionar e navegar até regiões da interface;
- ativa o modo de captura sem duplicar o hash;
- oferece `FigmaTarget`, `figmaTarget()` e hooks headless;
- integra com Vite durante `serve` e com Next.js App Router;
- publica ESM, CommonJS e declarações TypeScript.

## Instalação

```bash
pnpm add -D pittiquita
```

Uso rápido em React:

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

O painel aparece em `localhost` ou `127.0.0.1` e retorna `null` fora dessas origens.

## Playground local

```bash
pnpm install
pnpm build
pnpm --dir playground install
pnpm --dir playground dev
```

O playground demonstra `FigmaTarget`, `figmaTarget()`, regiões aninhadas, seção dinâmica e o painel de captura. A demonstração visual reproduzível está documentada em [docs/demo](./docs/demo/README.md).

## Arquitetura

| Área | Responsabilidade |
| --- | --- |
| `src/core/` | estado de captura, descoberta de regiões, guards e tipos compartilhados |
| `src/react/` | painel, componentes de alvo, acessibilidade e estilos |
| `src/vite/` | adaptador de desenvolvimento com montagem segura durante HMR |
| `src/next/` | integração com o App Router |
| `playground/` | aplicação local usada para validar o pacote no navegador |
| `tests/` | testes focados do core e das integrações |

## Segurança e limites

- o pacote não possui backend, contas, analytics ou telemetria;
- a interface só aparece em `localhost` e `127.0.0.1`;
- o script de captura externo só é carregado quando o modo está ativo;
- a página hospedeira deve tratar esse script como uma fronteira de confiança;
- eu não capturo segredos, tokens, dados pessoais ou conteúdo confidencial de produção.

Esses guards ajudam a manter o uso restrito ao desenvolvimento, mas não substituem autenticação ou isolamento de segurança. Consulte [SECURITY.md](./SECURITY.md) e a [documentação detalhada em português](./docs/README.pt-BR.md).

## Validação

```bash
pnpm test:run
pnpm typecheck
pnpm build
pnpm demo:check
```

## O que este projeto demonstra

Eu quis manter o escopo pequeno e verificável: uma ferramenta front-end com uma dor concreta, limites claros entre desenvolvimento e produção, APIs públicas documentadas e uma demo visual baseada no produto renderizado de verdade.

## Licença

MIT. Veja [LICENSE](./LICENSE).
