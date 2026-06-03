# Demo visual do pittiquita

Esta pasta contem um walkthrough visual curto gerado com Playwright para o fluxo do pittiquita:

1. `01-localhost-panel.png` - o playground rodando em localhost com o painel de captura visivel.
2. `02-capture-active.png` - modo de captura apos clicar em `Activate capture`.
3. `03-copy-url.png` - URL completa com `#figmacapture=manual` pronta para copiar.
4. `04-figma-import-step.png` - mock local ilustrativo mostrando onde a URL e colada no plugin HTML to Design do Figma.

A ultima tela e intencionalmente um mock. Ela evita exigir login no Figma ou uma sessao real do plugin, mas documenta o passo de handoff com honestidade.

**Idioma:** Portugues (padrao) | [English](./README.en.md)

## Regenerar

```bash
pnpm build
pnpm --dir playground install
pnpm run demo:capture
```

Se o Playwright nao encontrar um navegador local, rode:

```bash
pnpm exec playwright install chromium
```
