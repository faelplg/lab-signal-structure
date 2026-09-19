import { makeSignals, updateSignal, type Signal } from './signal';
import { evaluateRelations, type FieldState } from './rules';

export interface SignalSystem {
  // Altera parâmetros globais sem expor o estado interno dos sinais.
  setField(next: Partial<Pick<FieldState, 'reach' | 'affinity'>>): void;
  // Controla avanço do tempo; renderizações sob demanda continuam possíveis.
  setMotion(running: boolean): void;
  // Libera canvas, frame, observer e listeners criados por esta instância.
  destroy(): void;
}

// Estes valores formam a assinatura perceptiva do estudo. Centralizá-los evita
// que decisões de densidade, ritmo e tempo fiquem escondidas no frame loop.
const SIGNAL_COUNT = 48;
const FRAME_DURATION = 1000 / 30;
const TIME_SCALE = 0.34;

// Coordena o estado do estudo, o ciclo do Canvas 2D e a ponte entre os dois.
// As regras de movimento e relação ficam em módulos puros para poderem ser
// lidas e experimentadas sem percorrer o ciclo de renderização inteiro.
export function createSignalSystem(
  container: HTMLElement,
  onCount: (count: number) => void,
  reducedMotion: boolean,
): SignalSystem {
  const field: FieldState = { reach: 0.52, affinity: 0.58, pointer: null };
  let signals: Signal[] = makeSignals(SIGNAL_COUNT);
  let running = !reducedMotion;
  let destroyed = false;
  let time = 0.84;
  let lastCount = -1;
  let width = 1;
  let height = 1;
  let frameRequest = 0;
  let lastFrameTime: number | null = null;

  // Canvas 2D cobre todas as primitivas necessárias sem uma dependência de
  // renderização. O canvas é decorativo para tecnologia assistiva porque a
  // descrição semântica da experiência pertence ao container #sketch.
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context)
    throw new Error('Canvas 2D não está disponível neste navegador.');
  canvas.setAttribute('aria-hidden', 'true');
  container.append(canvas);

  const render = () => {
    if (destroyed) return;

    // Cada frame segue a mesma ordem: limpar, mover, avaliar relações e
    // desenhar. Isso torna a imagem uma consequência visível das regras.
    context.fillStyle = 'rgb(17 18 16)';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'rgb(57 60 55 / 27.45%)';
    // A grade pontilhada oferece escala visual, mas não participa das regras.
    // Meio pixel alinha os pontos de 1 px à grade física em DPR 1.
    for (let x = 32; x < width; x += 32) {
      for (let y = 32; y < height; y += 32)
        context.fillRect(x - 0.5, y - 0.5, 1, 1);
    }

    for (const signal of signals) updateSignal(signal, time, width, height);
    const relations = evaluateRelations(signals, field, width, height);
    // O mapa de grau é calculado a partir das relações do frame. Não duplicamos
    // esse estado nos sinais porque ele deixa de ser válido no frame seguinte.
    const connected = new Map<Signal, number>();

    for (const relation of relations) {
      const alpha = 36 + relation.strength * 120 + (relation.active ? 18 : 0);
      context.strokeStyle = relation.active
        ? `rgb(184 219 167 / ${alpha / 255})`
        : `rgb(202 207 196 / ${alpha / 255})`;
      context.lineWidth = relation.strength > 0.65 ? 1.25 : 0.8;
      context.beginPath();
      context.moveTo(relation.a.x, relation.a.y);
      context.lineTo(relation.b.x, relation.b.y);
      context.stroke();
      connected.set(relation.a, (connected.get(relation.a) ?? 0) + 1);
      connected.set(relation.b, (connected.get(relation.b) ?? 0) + 1);
    }

    // O grau de cada sinal transforma a rede invisível em uma marca visual:
    // sinais conectados brilham e os mais coesos recebem um anel.
    for (const signal of signals) {
      const degree = connected.get(signal) ?? 0;
      if (degree >= 3) {
        context.strokeStyle = 'rgb(184 219 167 / 47.06%)';
        context.lineWidth = 1;
        context.beginPath();
        context.arc(signal.x, signal.y, 6.5, 0, Math.PI * 2);
        context.stroke();
      }
      context.fillStyle =
        degree > 0 ? 'rgb(231 235 224 / 88.24%)' : 'rgb(127 133 123 / 56.86%)';
      context.beginPath();
      context.arc(signal.x, signal.y, degree > 0 ? 2 : 1.5, 0, Math.PI * 2);
      context.fill();
    }

    if (lastCount !== relations.length) {
      // Evita atualizar texto e árvore de acessibilidade quando nada mudou.
      lastCount = relations.length;
      onCount(lastCount);
    }
  };

  const scheduleFrame = () => {
    // frameRequest também funciona como trava contra dois loops concorrentes.
    if (running && !destroyed && frameRequest === 0)
      frameRequest = requestAnimationFrame(drawFrame);
  };

  // requestAnimationFrame acompanha a tela, enquanto este limite mantém a
  // simulação próxima de 30 fps e usa o tempo real entre frames desenhados.
  function drawFrame(timestamp: number) {
    frameRequest = 0;
    if (!running || destroyed) return;
    if (lastFrameTime === null) lastFrameTime = timestamp;

    const elapsed = timestamp - lastFrameTime;
    if (elapsed >= FRAME_DURATION) {
      // Preservar o resto reduz deriva de tempo quando a taxa real da tela não é
      // múltipla de 30 Hz.
      lastFrameTime = timestamp - (elapsed % FRAME_DURATION);
      time += (elapsed / 1000) * TIME_SCALE;
      render();
    }
    scheduleFrame();
  }

  const resize = () => {
    if (destroyed) return;
    const bounds = container.getBoundingClientRect();
    const density = Math.min(window.devicePixelRatio || 1, 2);
    // CSS controla o tamanho lógico; o buffer interno recebe DPR de até 2 para
    // manter nitidez sem quadruplicar custo indefinidamente em telas densas.
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    canvas.width = Math.max(1, Math.round(width * density));
    canvas.height = Math.max(1, Math.round(height * density));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    // Depois de redimensionar, o browser limpa o contexto e restaura a matriz.
    // Reaplicar a escala permite continuar desenhando em coordenadas CSS.
    context.setTransform(density, 0, 0, density, 0, 0);
    render();
  };

  const updatePointer = (event: PointerEvent) => {
    const bounds = canvas.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return;
    field.pointer = {
      // A conversão protege o domínio caso o tamanho visual e o tamanho lógico
      // divirjam por zoom, transformação CSS ou arredondamento de pixels.
      x: ((event.clientX - bounds.left) * width) / bounds.width,
      y: ((event.clientY - bounds.top) * height) / bounds.height,
    };
    if (!running) render();
  };

  const leave = () => {
    field.pointer = null;
    if (!running) render();
  };

  // Pointer Events unifica mouse, caneta e toque sem manter caminhos paralelos.
  canvas.addEventListener('pointermove', updatePointer);
  container.addEventListener('pointerleave', leave);
  window.addEventListener('resize', resize);

  // ResizeObserver cuida de mudanças de layout que não são necessariamente
  // acompanhadas por window.resize, como a troca entre layouts responsivos.
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();
  scheduleFrame();

  return {
    setField(next) {
      if (destroyed) return;
      Object.assign(field, next);
      if (!running) render();
    },
    setMotion(next) {
      if (destroyed) return;
      running = next;
      lastFrameTime = null;
      if (running) {
        scheduleFrame();
      } else {
        // Pausar cancela o frame pendente e ainda produz um último desenho. Isso
        // mantém controles e ponteiro úteis como instrumentos de observação.
        if (frameRequest !== 0) cancelAnimationFrame(frameRequest);
        frameRequest = 0;
        render();
      }
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      // O teardown é completo porque laboratórios podem ser montados novamente
      // por navegação parcial, testes ou integração externa.
      if (frameRequest !== 0) cancelAnimationFrame(frameRequest);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      container.removeEventListener('pointerleave', leave);
      canvas.removeEventListener('pointermove', updatePointer);
      canvas.remove();
      signals = [];
    },
  };
}
