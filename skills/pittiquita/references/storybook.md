# Storybook React

Configure o **preview**, não o manager. As stories vivem em outro documento, dentro do iframe. Confira primeiro se a versão instalada expõe `pittiquita/storybook`; a integração foi introduzida em `0.2.0`.

## Configuração

Mescle com `.storybook/preview.ts` ou `.tsx` existente. Preserve decorators, parâmetros e providers já configurados:

```ts
import type { Preview } from '@storybook/react-vite'
import { withPittiquita } from 'pittiquita/storybook'

const preview = {
  decorators: process.env.NODE_ENV === 'development' ? [withPittiquita()] : [],
} satisfies Preview

export default preview
```

Use o tipo `Preview` do framework React instalado. Se já houver decorators, acrescente o do Pittiquita sem substituí-los. Para uma única story, coloque o decorator nessa story em vez de configurá-lo globalmente.

O decorator marca o canvas sem wrapper extra, monta um portal fora do layout, acompanha o ID da story e preserva os alvos explícitos do componente. Docs fica sem painel para não duplicar a interface entre múltiplas stories. O guard de desenvolvimento do exemplo permite eliminar o decorator do build estático.

Opções por componente/story:

```ts
parameters: {
  pittiquita: {
    label: 'Resumo do pedido',
    position: 'bottom-left',
    target: false, // Somente regioes explicitamente marcadas.
  },
}
```

Use `parameters: { pittiquita: false }` para desativar. `target` é `true` por padrão. As opções por story sobrescrevem as do decorator com merge superficial; `theme` e `labels` substituem o objeto equivalente do decorator.

## Duplicação com Vite

O builder Vite pode herdar `vite.config.ts`. Se ele já contém `pittiquita/vite`, não acrescente também o decorator sem excluir aquela montagem do preview. Use uma configuração Vite específica para Storybook via `framework.options.builder.viteConfigPath`, preservando os plugins e aliases necessários ao consumidor.

Não desative o plugin no app inteiro só para resolver o Storybook. Não monte `FigmaCapturePanel` dentro de cada story junto de um decorator global.

## URL e estado capturável

Use **Open in isolation mode** ou **Open canvas in new tab**, ajuste o estado nessa aba e ative a captura. Copie `iframe.html?id=...&viewMode=story...#figmacapture=manual`, preservando os argumentos/globals presentes. A URL `?path=/story/...` pertence ao manager.

Abrir outra aba recria o estado local. Para reproduzir variantes, prefira args e stories dedicadas; Pittiquita não serializa cliques nem o estado interno do componente.

Se o subpath não existir na versão instalada, não invente um addon em `.storybook/main.ts`. Use a montagem manual do painel em um decorator de preview React, apenas em `viewMode === 'story'`, com guard de ambiente e sem outro montador, ou proponha usar uma versão que realmente tenha a integração.

Valide um painel no Canvas, nenhum em Docs, atualização de Controls e ausência no build estático. React/Vite é o exemplo verificado no repositório; outros builders exigem validação própria.
