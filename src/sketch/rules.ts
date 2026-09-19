import type { Signal } from './signal';

// O campo contém apenas parâmetros que podem mudar durante a observação. Reach
// e affinity usam domínio 0..1; pointer é local ao canvas e pode estar ausente.
export interface FieldState {
  reach: number;
  affinity: number;
  pointer: { x: number; y: number } | null;
}

export interface Relation {
  a: Signal;
  b: Signal;
  // Intensidade visual normalizada da relação que passou pelos dois critérios.
  strength: number;
  // active não cria a relação: apenas registra influência local do ponteiro.
  active: boolean;
}

// Avalia cada par uma vez. Uma relação precisa passar por distância e
// alinhamento; o ponteiro apenas amplia a vizinhança de relações próximas. A
// função é pura em relação ao DOM e ao canvas para manter a regra inspecionável.
export function evaluateRelations(
  signals: Signal[],
  field: FieldState,
  width: number,
  height: number,
): Relation[] {
  const relations: Relation[] = [];
  // Usar o menor eixo conserva uma escala visual comparável entre layouts
  // horizontais e verticais, sem deixar a dimensão maior dominar o alcance.
  const scale = Math.min(width, height);
  // Os coeficientes são heurísticas visuais documentadas pelo estudo, não uma
  // medida física. Eles mantêm o campo legível em todo o intervalo dos controles.
  const baseRange = scale * (0.115 + field.reach * 0.13);
  const alignmentThreshold = 0.85 - field.affinity * 1.5;

  // j começa após i para que cada par não ordenado seja avaliado exatamente uma
  // vez e um sinal nunca forme relação consigo mesmo.
  for (let i = 0; i < signals.length; i += 1) {
    for (let j = i + 1; j < signals.length; j += 1) {
      const a = signals[i];
      const b = signals[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.hypot(dx, dy);
      // Esta primeira barreira evita cálculos mais caros para pares distantes.
      if (distance > baseRange * 1.55) continue;

      const midpointX = (a.x + b.x) / 2;
      const midpointY = (a.y + b.y) / 2;
      // A influência usa o ponto médio da possível linha. O ponteiro revela
      // relações próximas, mas não desloca nenhum dos sinais.
      const pointerDistance = field.pointer
        ? Math.hypot(midpointX - field.pointer.x, midpointY - field.pointer.y)
        : Infinity;
      const localInfluence = Math.max(0, 1 - pointerDistance / (scale * 0.32));
      const range = baseRange * (1 + localInfluence * 0.55);
      // Produto escalar normalizado produz afinidade direcional entre -1 e 1:
      // 1 indica direções equivalentes e -1, direções opostas.
      const alignment =
        (a.dx * b.dx + a.dy * b.dy) /
        (Math.hypot(a.dx, a.dy) * Math.hypot(b.dx, b.dy));
      const threshold = alignmentThreshold - localInfluence * 0.7;
      // A relação só existe quando os dois critérios são satisfeitos.
      if (distance >= range || alignment <= threshold) continue;

      const distanceScore = 1 - distance / range;
      const alignmentScore = (alignment - threshold) / (1 - threshold);
      // Distância recebe peso maior porque proximidade deve ser a leitura
      // dominante; alinhamento refina a relação sem apagar a geometria do campo.
      relations.push({
        a,
        b,
        strength: Math.min(1, distanceScore * 0.65 + alignmentScore * 0.35),
        active: localInfluence > 0.28,
      });
    }
  }
  return relations;
}
