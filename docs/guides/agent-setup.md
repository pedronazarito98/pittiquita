# Pittiquita para agentes

O pacote inclui uma skill para ajudar agentes a configurar o painel, marcar os componentes pedidos pelo usuário e diagnosticar a captura. As instruções ficam no projeto consumidor e podem ser versionadas junto com ele.

**Disponibilidade:** a skill, o comando abaixo e o export de Storybook fazem parte de `pittiquita@0.2.0`. Atualize instalações anteriores antes de usá-los. Também é possível usar o build deste checkout ou um pacote gerado localmente.

## Instalação no projeto consumidor

Instale ou atualize a dependência de desenvolvimento com o gerenciador do projeto. Exemplo com pnpm:

```bash
pnpm add -D pittiquita@^0.2.0
```

Depois, rode na pasta que contém o `package.json` do app:

```bash
pnpm exec pittiquita agents init --dry-run
pnpm exec pittiquita agents init
```

Use o gerenciador do projeto. Com npm e o pacote já instalado localmente, o equivalente é `npm exec -- pittiquita agents init`. Não é necessário instalar uma ferramenta global.

O comando:

- copia a skill para `.agents/skills/pittiquita/`;
- acrescenta um bloco curto ao `AGENTS.md`, preservando seu conteúdo;
- usa `AGENTS.override.md` quando esse arquivo existe e não está vazio, respeitando sua precedência no Codex;
- mostra os arquivos planejados sem escrever nada quando recebe `--dry-run`.

Ele não instala dependências, não configura a aplicação, não acessa a rede e não altera configurações globais do agente. A instalação é explícita; não existe script de `postinstall`.

Em monorepos, escolha o diretório do app solicitado. Use a raiz do workspace apenas quando as instruções precisarem ser compartilhadas entre os apps; essa pasta também precisa ter `package.json`.

## Como pedir ao agente

No Codex, a skill pode ser selecionada pela descrição ou chamada explicitamente:

```text
$pittiquita configure a captura neste app Vite.
```

Outros exemplos:

```text
Adicione uma região Pittiquita ao card de resumo. O painel já está instalado.
Habilite Pittiquita somente na story de checkout.
Mova o painel para o canto inferior esquerdo e marque o cabeçalho da página.
```

A orientação distingue **montar o painel** de **marcar um componente**. Adicionar captura a três cards não deve criar três painéis nem mudar o layout dos cards.

O Codex procura skills em `.agents/skills` e lê as instruções do projeto ao iniciar a sessão. Após a instalação, inicie uma nova sessão para carregar também o bloco de `AGENTS.md`. Veja a documentação oficial de [skills](https://developers.openai.com/codex/skills) e [instruções do projeto](https://developers.openai.com/codex/guides/agents-md).

Em outros agentes, a descoberta automática depende do cliente. Aponte explicitamente para `.agents/skills/pittiquita/SKILL.md` ou use o mecanismo de skills desse cliente. O instalador não cria configurações específicas para cada editor.

## Conteúdo instalado

```text
.agents/skills/pittiquita/
  SKILL.md
  references/
    react-vite.md
    nextjs.md
    storybook.md
    targets.md
    troubleshooting.md
```

O arquivo principal orienta o agente a conferir a versão, os exports realmente instalados e a estrutura do app antes de editar. Ele encaminha apenas para as referências necessárias à tarefa, cobrindo:

- montagem manual em React ou automática em Vite, sem duplicação;
- App Router e Pages Router, preservando as fronteiras entre servidor e cliente;
- decorator no preview do Storybook, opções por story e URL do iframe;
- marcação no elemento DOM existente, preservando estilos, semântica e props;
- captura restrita a desenvolvimento local e distinção entre painel, script injetado e importação concluída no Figma.

## Reexecução e arquivos personalizados

Rodar o comando novamente com os mesmos arquivos não duplica conteúdo. Se uma skill existente ou o bloco gerenciado tiver sido alterado, o comando interrompe antes das escritas e pede uma mesclagem manual. Isso também se aplica a atualizações do pacote que alterem a skill; não há opção de sobrescrita forçada.

As instruções anteriores e suas quebras de linha são preservadas. Caminhos com links simbólicos, arquivos especiais ou hard links são recusados. Falhas de escrita no sistema de arquivos podem deixar parte dos novos arquivos instalada; revise a saída e corrija a causa antes de repetir o comando. Não há rollback que apague arquivos.

O instalador não muda o `.gitignore`. Confira se as instruções e a skill devem ser versionadas segundo as regras do projeto.

## Experimentar a partir do checkout

Compile a biblioteca na raiz do Pittiquita:

```bash
pnpm build
```

Depois, dentro do projeto consumidor, execute o CLI compilado:

```bash
node /caminho/para/pittiquita/dist/cli.js agents init --dry-run
node /caminho/para/pittiquita/dist/cli.js agents init
```

Isso instala as instruções. A dependência Pittiquita do app continua sendo configurada separadamente, com a versão e o gerenciador adequados ao projeto.

Para validar o fluxo completo, abra uma nova sessão do agente no consumidor, peça a marcação de um componente real e revise o diff: o elemento correto deve ser marcado, as APIs devem existir na versão instalada e o painel deve aparecer apenas uma vez.
