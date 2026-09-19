import './styles/main.css';
import { createSignalSystem } from './sketch/system';

// A página fornece a superfície editorial; o sistema visual só começa quando
// todos os controles necessários estão presentes.
const sketchElement = document.querySelector<HTMLElement>('#sketch');
const countElement = document.querySelector<HTMLElement>('#connection-count');
const reachInput = document.querySelector<HTMLInputElement>('#reach');
const affinityInput = document.querySelector<HTMLInputElement>('#affinity');
const reachValue = document.querySelector<HTMLOutputElement>('#reach-value');
const affinityValue = document.querySelector<HTMLOutputElement>('#affinity-value');
const motionButton = document.querySelector<HTMLButtonElement>('#motion-toggle');
const stateLabel = document.querySelector<HTMLElement>('#state-label');

if (sketchElement && countElement && reachInput && affinityInput && reachValue && affinityValue && motionButton && stateLabel) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const system = createSignalSystem(sketchElement, count => {
    countElement.textContent = `${String(count).padStart(2, '0')} CONEXÕES`;
  }, media.matches);
  let running = !media.matches;
  let manuallySetMotion = false;

  // Centraliza o estado do movimento para manter canvas, botão e indicador
  // textual sincronizados, inclusive no primeiro carregamento.
  function setMotion(next: boolean) {
    running = next;
    system.setMotion(next);
    motionButton!.setAttribute('aria-pressed', String(!next));
    motionButton!.querySelector('.button-symbol')!.textContent = next ? 'Ⅱ' : '▷';
    motionButton!.lastElementChild!.innerHTML = next ? 'PAUSAR<br />MOVIMENTO' : 'RETOMAR<br />MOVIMENTO';
    stateLabel!.textContent = next ? 'EM MOVIMENTO' : 'EM PAUSA';
  }

  setMotion(running);
  // Os sliders representam percentuais na interface, mas o domínio interno
  // usa valores entre 0 e 1 para que as regras possam combinar os controles.
  reachInput.addEventListener('input', () => {
    const value = Number(reachInput.value);
    reachValue.textContent = `${value}%`;
    system.setField({ reach: value / 100 });
  });
  affinityInput.addEventListener('input', () => {
    const value = Number(affinityInput.value);
    affinityValue.textContent = `${value}%`;
    system.setField({ affinity: value / 100 });
  });
  motionButton.addEventListener('click', () => { manuallySetMotion = true; setMotion(!running); });
  media.addEventListener('change', event => { if (!manuallySetMotion) setMotion(!event.matches); });

  // Superfície mínima para integrações externas: controles públicos, não o
  // estado interno inteiro da simulação.
  Object.assign(window, { signalStructure: { setField: system.setField, setMotion, destroy: system.destroy } });
}
