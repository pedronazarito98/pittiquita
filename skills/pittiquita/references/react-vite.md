# React e Vite

Escolha entre montagem automática e manual conforme o escopo pedido. Não combine as duas no mesmo documento.

## Vite: painel em todas as páginas de desenvolvimento

Se `pittiquita/vite` existir na versão instalada, acrescente `pittiquita()` à configuração existente sem substituir plugins, aliases ou outras opções:

```ts
import { pittiquita } from 'pittiquita/vite'

// Dentro do array de plugins existente:
plugins: [react(), pittiquita({ position: 'bottom-right' })]
```

O plugin usa `apply: 'serve'`, injeta um módulo virtual e monta o painel no body. Não injeta esse módulo no `vite build`.

As opções passam por JSON: callbacks e `labels.regionsCount` não são serializados. Se forem necessários, use a montagem manual. Não configure `pathname`/`searchKey` no plugin.

## React: montar manualmente ou limitar a uma rota

Use a superfície que já representa a rota ou layout solicitado, ao lado do conteúdo, sem alterar providers. Exemplo para um projeto Vite:

```tsx
import { FigmaCapturePanel } from 'pittiquita'

export function AccountPage() {
  return (
    <>
      <AccountContent />
      {import.meta.env.DEV && <FigmaCapturePanel position="bottom-left" />}
    </>
  )
}
```

`AccountContent` representa o conteúdo que já existe; não crie componentes de exemplo se a tarefa é editar uma página real. Use o guard de ambiente do projeto se ele não usa Vite; não acrescente `import.meta.env` a um bundler diferente.

Se já houver um painel global e o pedido for marcar apenas a página, mantenha-o e marque a região. Se o usuário pedir que o **painel** apareça apenas nessa rota, retire a montagem global correspondente ao migrar para a montagem local; preserve outras configurações do plugin/bundler.

## Opções que importam

- `position`: `bottom-right`, `bottom-left`, `top-right`, `top-left`.
- `theme`: overrides dos tokens existentes, sem nova biblioteca de estilos.
- `labels`, `className`, `classNames`: personalização do painel existente.
- `pathname`, `searchKey`: sinais de navegação para atualizar regiões na montagem manual. Passe strings estáveis, não objetos de router.
- `onRegionSelect`, `onCaptureActivate`: callbacks da montagem manual; não realizam importação autenticada.

O painel já começa oculto até confirmar o hostname no client. Isso evita acesso obrigatório ao DOM no render inicial, mas não substitui a fronteira de cliente de frameworks com Server Components.

## Verifique

Abra o app em `localhost`/`127.0.0.1`, confirme um único painel, navegue entre as rotas afetadas e confira o guard de produção. Não considere apenas um build bem-sucedido como prova de montagem correta.
