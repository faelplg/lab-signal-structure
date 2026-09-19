import p5 from 'p5';
import { makeSignals, updateSignal, type Signal } from './signal';
import { evaluateRelations, type FieldState } from './rules';

export interface SignalSystem {
  setField(next: Partial<Pick<FieldState, 'reach' | 'affinity'>>): void;
  setMotion(running: boolean): void;
  destroy(): void;
}

// Coordena o estado do estudo, a simulação p5 e a ponte entre os dois.
// As regras de movimento e relação ficam em módulos puros para poderem ser
// lidas e experimentadas sem percorrer o ciclo de renderização inteiro.
export function createSignalSystem(container: HTMLElement, onCount: (count: number) => void, reducedMotion: boolean): SignalSystem {
  const field: FieldState = { reach: 0.52, affinity: 0.58, pointer: null };
  let signals: Signal[] = makeSignals(48);
  let running = !reducedMotion;
  let time = 0.84;
  let lastCount = -1;

  const sketch = (p: p5) => {
    const render = () => {
      // Cada frame segue a mesma ordem: limpar, mover, avaliar relações e
      // desenhar. Isso torna a imagem uma consequência visível das regras.
      const width = p.width;
      const height = p.height;
      p.background(17, 18, 16);

      p.stroke(57, 60, 55, 70);
      p.strokeWeight(1);
      for (let x = 32; x < width; x += 32) {
        for (let y = 32; y < height; y += 32) p.point(x, y);
      }

      for (const signal of signals) updateSignal(signal, time, width, height);
      const relations = evaluateRelations(signals, field, width, height);
      const connected = new Map<Signal, number>();

      for (const relation of relations) {
        const alpha = 36 + relation.strength * 120;
        if (relation.active) p.stroke(184, 219, 167, alpha + 18);
        else p.stroke(202, 207, 196, alpha);
        p.strokeWeight(relation.strength > 0.65 ? 1.25 : 0.8);
        p.line(relation.a.x, relation.a.y, relation.b.x, relation.b.y);
        connected.set(relation.a, (connected.get(relation.a) ?? 0) + 1);
        connected.set(relation.b, (connected.get(relation.b) ?? 0) + 1);
      }

      // O grau de cada sinal transforma a rede invisível em uma marca visual:
      // sinais conectados brilham e os mais coesos recebem um anel.
      for (const signal of signals) {
        const degree = connected.get(signal) ?? 0;
        if (degree >= 3) {
          p.noFill();
          p.stroke(184, 219, 167, 120);
          p.strokeWeight(1);
          p.circle(signal.x, signal.y, 13);
        }
        p.noStroke();
        if (degree > 0) p.fill(231, 235, 224, 225);
        else p.fill(127, 133, 123, 145);
        p.circle(signal.x, signal.y, degree > 0 ? 4 : 3);
      }

      if (lastCount !== relations.length) {
        lastCount = relations.length;
        onCount(lastCount);
      }
    };

    p.setup = () => {
      const bounds = container.getBoundingClientRect();
      const canvas = p.createCanvas(Math.max(1, bounds.width), Math.max(1, bounds.height));
      canvas.parent(container);
      p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
      p.frameRate(30);
      render();
      if (!running) p.noLoop();
    };

    // O tempo só avança em movimento. Mesmo parado, um novo campo ou ponteiro
    // pode solicitar um render para que a observação continue interativa.
    p.draw = () => {
      if (running) time += p.deltaTime / 1000 * 0.34;
      render();
    };

    p.windowResized = () => {
      const bounds = container.getBoundingClientRect();
      p.resizeCanvas(Math.max(1, bounds.width), Math.max(1, bounds.height));
      render();
    };

    p.mouseMoved = () => {
      if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
        field.pointer = { x: p.mouseX, y: p.mouseY };
        if (!running) render();
      }
    };

    p.touchMoved = () => {
      field.pointer = { x: p.mouseX, y: p.mouseY };
      if (!running) render();
    };
  };

  const instance = new p5(sketch);
  // ResizeObserver cuida de mudanças de layout que não são necessariamente
  // acompanhadas por window.resize, como a troca entre layouts responsivos.
  const leave = () => { field.pointer = null; if (!running) instance.redraw(); };
  container.addEventListener('pointerleave', leave);
  const observer = new ResizeObserver(() => {
    const bounds = container.getBoundingClientRect();
    instance.resizeCanvas(Math.max(1, bounds.width), Math.max(1, bounds.height));
  });
  observer.observe(container);

  return {
    setField(next) { Object.assign(field, next); if (!running) instance.redraw(); },
    setMotion(next) { running = next; if (running) instance.loop(); else { instance.noLoop(); instance.redraw(); } },
    destroy() { observer.disconnect(); container.removeEventListener('pointerleave', leave); instance.remove(); signals = []; },
  };
}
