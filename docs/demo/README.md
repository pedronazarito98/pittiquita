# Demo reproduzível do pittiquita

Esta pasta contém a demonstração curta e reproduzível do fluxo React → pittiquita → HTML to Design. A automação abre apenas o playground local, seleciona uma região, ativa a captura, copia a URL com o hash e termina em um mock local claramente identificado.

> **Illustrative Figma step** · **Local mock — no Figma login required**
>
> A última tela documenta o handoff para o plugin HTML to Design. Ela não simula uma importação autenticada, não acessa uma conta do Figma e não envia a URL para um serviço externo.

**Idioma:** Português (padrão) | [English](./README.en.md)

## Artefatos versionados

| Arquivo | Conteúdo | Budget |
| --- | --- | ---: |
| `01-localhost-panel.png` | Playground local, painel e regiões marcadas | 500 KiB |
| `02-region-selected.png` | Região Hero selecionada; no fallback, a ação é indicada por uma anotação `DEMO` | 500 KiB |
| `02-capture-active.png` | Captura ativa e hash local | 500 KiB |
| `03-copy-url.png` | Overlay temporário da demo para copiar a URL pelo navegador | 500 KiB |
| `04-figma-import-step.png` | Mock ilustrativo e rotulado do handoff | 500 KiB |
| `pittiquita-flow.webm` | Fluxo completo em VP9, entre 8 e 15 segundos | 3 MiB |
| `pittiquita-flow.gif` | Mesmo fluxo, convertido do WebM | 4 MiB |

O budget total é 9 MiB. GIF, WebM e screenshots são versionados porque fazem parte da primeira experiência do repositório e precisam renderizar sem depender de um build, de um serviço externo ou de uma conta do Figma.

## Regeneração padrão

Pré-requisitos:

- Node.js 20 ou mais recente e pnpm 10;
- Chromium instalado pelo Playwright;
- `ffmpeg` e `ffprobe` 6 ou mais recentes disponíveis no `PATH`.

Partindo de um clone limpo:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm --dir playground install --frozen-lockfile
pnpm exec playwright install chromium
pnpm demo:record
pnpm demo:check
```

`demo:record` regenera os cinco PNGs, grava o WebM com Playwright, converte esse mesmo vídeo em GIF e executa a validação completa. `demo:capture` regenera somente os PNGs. `demo:check` não confia apenas na extensão: usa `ffprobe` para inspecionar os streams e `ffmpeg` para decodificar todos os sete arquivos.

O controle “Copy URL” mostrado no passo 3 pertence somente ao overlay temporário da automação e usa a Clipboard API do navegador. Ele não é uma API, botão ou capacidade nativa anunciada pelo pittiquita; serve apenas para tornar visível a ação manual de copiar a URL do navegador.

## Instalar ffmpeg

| Sistema | Exemplo |
| --- | --- |
| Ubuntu/Debian | `sudo apt-get update && sudo apt-get install ffmpeg` |
| macOS | `brew install ffmpeg` |
| Windows | `winget install Gyan.FFmpeg` ou `choco install ffmpeg` |

No Windows, abra um novo terminal depois da instalação e confirme `ffmpeg -version` e `ffprobe -version`. Caminhos customizados são aceitos pelas variáveis abaixo.

## Variáveis de ambiente

| Variável | Padrão | Uso |
| --- | --- | --- |
| `PITTIQUITA_DEMO_PORT` | `4175` | Porta local, entre 1 e 65535; o Vite usa `--strictPort` |
| `PLAYWRIGHT_CHANNEL` | Chromium do Playwright | Canal local opcional, como `chrome` ou `msedge` |
| `PITTIQUITA_FFMPEG_PATH` | `ffmpeg` | Caminho do executável de codificação |
| `PITTIQUITA_FFPROBE_PATH` | `ffprobe` | Caminho do executável de inspeção |
| `PITTIQUITA_DEMO_FROM_SCREENSHOTS` | desativado | Fallback explícito equivalente a `--from-screenshots` |

Exemplo com outra porta:

```bash
PITTIQUITA_DEMO_PORT=5180 pnpm demo:record
```

PowerShell:

```powershell
$env:PITTIQUITA_DEMO_PORT = '5180'
pnpm demo:record
```

## Fallback sem navegador

Quando Chromium não pode ser instalado, os artefatos animados podem ser reconstruídos deterministicamente a partir dos cinco PNGs já versionados:

```bash
pnpm demo:record -- --from-screenshots
pnpm demo:check
```

Esse fallback é deliberadamente explícito e imprime que o navegador não foi aberto. Em `02-region-selected.png`, a moldura e o rótulo `DEMO · Hero selecionado` são uma anotação visual adicionada sobre um screenshot real para tornar a ação inequívoca; não são UI nativa do pittiquita. O fallback preserva a sequência e a duração, mas **não substitui** o gate Playwright: não comprova que o playground atual ainda pode gerar os screenshots. Antes de um release, rode `pnpm demo:record` sem o fallback em uma máquina ou no workflow com Chromium.

## Isolamento e cleanup

- Nenhum `.env`, token, dado privado ou login é utilizado.
- A única origem liberada é `http://127.0.0.1:<porta>`.
- O script remoto de captura é interceptado por um no-op local; outras requisições externas são bloqueadas.
- Browser, contexto e servidor Vite são encerrados em ordem, inclusive em falhas e em `SIGINT`/`SIGTERM`.
- O servidor roda em um grupo de processos próprio no Linux/macOS e usa `taskkill /T` no Windows.
- Vídeos brutos e arquivos intermediários ficam no diretório temporário do sistema e são removidos ao final.
- Os logs do playground ficam limitados em memória e são incluídos no erro quando o servidor encerra antes de ficar pronto.

## CI

O CI principal executa os testes leves e `pnpm demo:check` sobre os binários versionados. O workflow **Demo reproduzível** instala Chromium e ffmpeg, regenera a mídia quando arquivos da demo mudam ou por execução manual, valida os resultados e envia PNG, GIF e WebM como artefato para inspeção visual.

O workflow completo não precisa rodar em PRs sem mudanças na demo; isso mantém o gate comum rápido sem perder uma verificação real quando a automação é alterada.

## Troubleshooting

### Chromium não encontrado

```bash
pnpm exec playwright install chromium
```

Em Linux minimalista/CI, use `pnpm exec playwright install --with-deps chromium`. Se um navegador de sistema já estiver instalado, tente `PLAYWRIGHT_CHANNEL=chrome` ou `PLAYWRIGHT_CHANNEL=msedge`.

### Porta ocupada

Escolha outra porta com `PITTIQUITA_DEMO_PORT`. Valores inválidos falham antes de iniciar qualquer processo, e `--strictPort` impede que Vite migre silenciosamente para outra porta.

### ffmpeg ou ffprobe não encontrado

Confirme que ambos estão no `PATH` ou configure `PITTIQUITA_FFMPEG_PATH` e `PITTIQUITA_FFPROBE_PATH`. Os dois devem pertencer à mesma instalação do ffmpeg.

### Budget ou duração falhou

Rode `pnpm demo:check`; o relatório mostra dimensões, codec, duração e peso medidos de cada arquivo. Não aumente o budget antes de investigar resolução, FPS, tempo parado e regressões visuais.

### O processo foi interrompido

O cleanup aguarda até cinco segundos e então força o encerramento da árvore. Se a porta continuar ocupada, encerre manualmente o processo residual e registre o sistema operacional e os logs exibidos para reproduzir o problema.
