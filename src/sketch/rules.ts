import type { Signal } from './signal';

export interface FieldState {
  reach: number;
  affinity: number;
  pointer: { x: number; y: number } | null;
}

export interface Relation {
  a: Signal;
  b: Signal;
  strength: number;
  active: boolean;
}

// Avalia cada par uma vez. Uma relação precisa passar por distância e
// alinhamento; o ponteiro apenas amplia a vizinhança de relações próximas.
export function evaluateRelations(signals: Signal[], field: FieldState, width: number, height: number): Relation[] {
  const relations: Relation[] = [];
  const scale = Math.min(width, height);
  const baseRange = scale * (0.115 + field.reach * 0.13);
  const alignmentThreshold = 0.85 - field.affinity * 1.5;

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
      const pointerDistance = field.pointer ? Math.hypot(midpointX - field.pointer.x, midpointY - field.pointer.y) : Infinity;
      const localInfluence = Math.max(0, 1 - pointerDistance / (scale * 0.32));
      const range = baseRange * (1 + localInfluence * 0.55);
      const alignment = (a.dx * b.dx + a.dy * b.dy) / (Math.hypot(a.dx, a.dy) * Math.hypot(b.dx, b.dy));
      const threshold = alignmentThreshold - localInfluence * 0.7;
      // A relação só existe quando os dois critérios são satisfeitos.
      if (distance >= range || alignment <= threshold) continue;

      const distanceScore = 1 - distance / range;
      const alignmentScore = (alignment - threshold) / (1 - threshold);
      relations.push({ a, b, strength: Math.min(1, distanceScore * 0.65 + alignmentScore * 0.35), active: localInfluence > 0.28 });
    }
  }
  return relations;
}
