# Next.js

Identifique App Router (`app/` ou `src/app/`) e Pages Router (`pages/` ou `src/pages/`). Confira se a versão instalada exporta `PittiquitaNextPanel` em `pittiquita/next`.

## App Router

Monte uma vez no layout compartilhado apropriado, ou no segmento solicitado. Preserve o layout como Server Component e mantenha a fronteira de cliente em um componente pequeno:

```tsx
// Exemplo: app/PittiquitaDevTools.tsx
'use client'

import { PittiquitaNextPanel } from 'pittiquita/next'

export function PittiquitaDevTools() {
  return <PittiquitaNextPanel position="bottom-right" />
}
```

Importe `PittiquitaDevTools` pelo caminho real no layout existente e renderize ao lado de `children`. Use esse wrapper apenas se não houver uma fronteira de cliente adequada. Não converta o layout inteiro em client nem crie barrel exports.

A implementação fonte do adaptador tem `'use client'`, mas o build atual em tsup não preserva essa diretiva no entry point distribuído. Por isso, uma fronteira explícita no consumidor é necessária ao importar do pacote compilado. Não prometa suporte RSC com base apenas no arquivo fonte.

O adaptador usa `usePathname()`, encaminha mudanças de rota e retorna `null` fora de development por padrão. O hostname local continua obrigatório. Callbacks ficam dentro da fronteira de cliente; não passe funções comuns de Server Components para ela.

Se o adaptador não existir no pacote instalado, use `FigmaCapturePanel` em uma fronteira de cliente existente ou criada para os devtools, com guard de ambiente e `pathname` vindo de `usePathname()`. Não alegue disponibilidade de uma release ainda não publicada.

## Pages Router

Use `FigmaCapturePanel` dentro do `_app` existente ou da página solicitada, com `process.env.NODE_ENV === 'development'`. Se for necessário sinalizar navegação, use a API do router já presente no projeto e passe uma string estável a `pathname`/`searchKey`.

Não importe `next/navigation` nem o wrapper de App Router para resolver um pedido no Pages Router. Não adicione `'use client'` apenas por usar Pages Router.

## Evite a integração legada

`withPittiquita` de **`pittiquita/next`** é um wrapper de identidade depreciado. Ele não monta o painel no `next.config`.

Ele é diferente do decorator funcional `withPittiquita` de **`pittiquita/storybook`**. Confirme o caminho de importação, não apenas o nome.

## Alvos em Server Components

Para marcar um elemento DOM já existente em um Server Component, prefira atributos literais `data-figma-target` e `data-figma-label`. Não importe a entrada React interativa do pacote nem acrescente `'use client'` só para marcar uma seção. Veja [targets.md](targets.md).

Verifique build/SSR e navegação no app real. Renderizar `null` em produção não prova exclusão dos bytes do pacote. O exemplo React/Vite de Storybook não valida o runtime do Next.js.
