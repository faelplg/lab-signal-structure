// Um sinal separa seus parâmetros estáveis de órbita (origin, phase, rate,
// orbit e heading) do estado derivado de cada frame (x, y, dx e dy). Essa
// separação deixa explícito que o movimento é determinístico depois da criação.
export interface Signal {
  originX: number;
  originY: number;
  phase: number;
  rate: number;
  orbit: number;
  heading: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
}

// Cria a população inicial: uma malha reconhecível, com pequenas variações
// para que a estrutura não pareça desenhada com régua. A aleatoriedade existe
// apenas na inicialização; o frame loop não introduz ruído novo. Math.random
// não recebe seed de propósito, então cada carregamento é uma nova observação.
export function makeSignals(count: number): Signal[] {
  const signals: Signal[] = [];
  // A proporção 1.25 favorece mais colunas do que linhas, acompanhando o canvas
  // horizontal em desktop sem codificar uma quantidade fixa de linhas.
  const columns = Math.ceil(Math.sqrt(count * 1.25));
  const rows = Math.ceil(count / columns);
  for (let i = 0; i < count; i += 1) {
    const column = i % columns;
    const row = Math.floor(i / columns);
    // O jitter é relativo ao campo normalizado, então mantém caráter semelhante
    // em canvas pequenos e grandes.
    const jitterX = (Math.random() - 0.5) * 0.075;
    const jitterY = (Math.random() - 0.5) * 0.075;
    signals.push({
      originX: 0.09 + (column / Math.max(columns - 1, 1)) * 0.82 + jitterX,
      originY: 0.1 + (row / Math.max(rows - 1, 1)) * 0.8 + jitterY,
      phase: Math.random() * Math.PI * 2,
      rate: 0.45 + Math.random() * 0.65,
      orbit: 0.018 + Math.random() * 0.028,
      heading: Math.random() * Math.PI * 2,
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
    });
  }
  return signals;
}

// Converte a órbita abstrata de um sinal em posição e direção no canvas.
// As posições de origem não mudam; somente o deslocamento periódico muda. A
// posição usa pixels para desenho, enquanto a órbita permanece proporcional ao
// tamanho atual do campo.
export function updateSignal(
  signal: Signal,
  time: number,
  width: number,
  height: number,
): void {
  const angle = time * signal.rate + signal.phase;
  // Frequências ligeiramente diferentes nos eixos evitam círculos mecânicos e
  // produzem trajetórias fechadas mais lentas, sem um motor de física.
  const nextX =
    (signal.originX + Math.cos(angle + signal.heading) * signal.orbit) * width;
  const nextY =
    (signal.originY + Math.sin(angle * 0.78 + signal.heading) * signal.orbit) *
    height;
  // dx e dy representam direção, não velocidade em pixels. As regras precisam
  // apenas comparar orientação relativa entre sinais.
  signal.dx = -Math.sin(angle + signal.heading);
  signal.dy = Math.cos(angle * 0.78 + signal.heading);
  signal.x = nextX;
  signal.y = nextY;
}
