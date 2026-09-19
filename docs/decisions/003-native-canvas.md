# 003 - Canvas 2D nativo

## Contexto

O estudo usava p5 apenas como adaptador para criar o canvas, desenhar primitivas
simples e controlar o ciclo de animação. Essa conveniência adicionava mais de
1 MB ao chunk JavaScript minificado e fazia o build emitir um warning de bundle
acima de 500 kB. Dividir p5 em outro chunk esconderia a causa sem reduzir o
código entregue ao navegador.

## Decisão

O sistema passa a usar Canvas 2D e `requestAnimationFrame` nativos. O ciclo
limita o desenho a aproximadamente 30 fps, mantém o tempo congelado durante a
pausa e redesenha sob demanda quando campo, ponteiro ou dimensões mudam. Um
`ResizeObserver`, combinado ao evento de resize da janela, mantém a superfície
sincronizada com o layout e com a densidade de pixels do dispositivo.

A interface pública `SignalSystem` e a população de 48 sinais permanecem
inalteradas. Movimento e relações continuam em `signal.ts` e `rules.ts`; o
sistema segue responsável apenas por ciclo de vida, entrada e desenho.

## Consequências

- p5 e seus tipos deixam de fazer parte das dependências e do bundle.
- O warning desaparece pela redução do artefato, sem alterar o limite do Vite.
- Ponteiro e toque compartilham Pointer Events, sem caminhos paralelos.
- Pausa, retomada e `prefers-reduced-motion` mantêm o mesmo contrato externo.
- As primitivas usadas pelo estudo ficam explícitas em uma implementação local
  pequena, mas o projeto passa a cuidar diretamente do ciclo e da escala do
  canvas.
