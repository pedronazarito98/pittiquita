# Marcar o elemento solicitado

Localize o componente real que renderiza o alvo. Reutilize o painel existente. Marcar “o card de pedidos” não exige adicionar um painel ao card nem instalar Storybook.

## Prefira o elemento DOM existente

Em componentes React de cliente:

```tsx
import { figmaTarget } from 'pittiquita'

<section {...figmaTarget('orders-summary', { label: 'Resumo dos pedidos' })}>
  {existingContent}
</section>
```

Preserve `className`, `style`, refs, eventos, acessibilidade e children. O helper retorna apenas `data-figma-target` e `data-figma-label`. Em componentes customizados, confirme que os atributos são encaminhados ao DOM; caso contrário, marque o elemento concreto dentro do componente.

Em Server Components, ou quando uma importação da biblioteca criaria uma fronteira desnecessária, o contrato DOM pode ser aplicado diretamente:

```tsx
<section data-figma-target="orders-summary" data-figma-label="Resumo dos pedidos">
  {existingContent}
</section>
```

Não mova código para o client só para inserir esses atributos. Não derive identificadores de dados pessoais, credenciais ou valores sensíveis. Use nomes estáveis e descritivos; para listas, prefira marcar a seção solicitada antes de criar um alvo para cada item.

## Wrapper opcional

Use `FigmaTarget` quando um wrapper for aceitável ou quando ele substituir semanticamente o container existente:

```tsx
import { FigmaTarget } from 'pittiquita'

<FigmaTarget name="orders-summary" label="Resumo dos pedidos" as="section">
  {existingContent}
</FigmaTarget>
```

O componente aceita `name`, `label`, `as` e `children`; **não** aceita props arbitrárias como `className`, `style`, `id`, refs ou handlers. Não substitua um container que precisa dessas props por `FigmaTarget`. Evite wrappers extras em grid/flex, tabelas, listas, formulários e conteúdo com posicionamento.

## Alvos visíveis e seleção

- A descoberta exige dimensões não nulas e exclui `display: none`, `visibility: hidden` e descendentes de `data-figma-helper`.
- Modais, abas, acordeões e seções condicionais precisam estar abertos/renderizados. Preserve o comportamento existente para chegar até eles.
- O observer acompanha mudanças no DOM; normalmente não é preciso criar hooks ou chamadas manuais a `refresh()`.
- Selecionar uma região rola até ela e aplica `data-figma-selected="true"`. O pacote não fornece CSS de destaque nem transfere essa seleção automaticamente ao importador do Figma.
- `FigmaTarget`, `figmaTarget()` e atributos literais emitem markup também em produção. Se o pedido exige retirar os atributos, aplique o guard de ambiente do consumidor.

Valide a região no painel e compare layout, teclado e interação antes/depois. Informe ao usuário como abrir o estado que torna a região visível.
