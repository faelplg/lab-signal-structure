# Study 001 - Signal Structure

## Guia de leitura

Este documento explica o fenômeno antes da implementação. Para seguir a
hipótese no código, leia `signal.ts`, depois `rules.ts`, `system.ts` e `main.ts`.
Essa ordem acompanha a transformação de uma ideia em uma imagem observável.

## 1. Pergunta

Como sinais simples podem revelar estruturas quando suas relações mudam?

## 2. Hipótese

Uma composição não precisa ser desenhada de antemão. Sinais simples podem sugerir ordem quando conexões dependem de relações observáveis e transitórias.

## 3. Modelo do sistema

Quarenta e oito sinais ocupam posições aproximadamente distribuídas no campo. Cada um percorre uma órbita pequena, em ritmo e fase próprios. Um par se conecta somente quando sua distância está dentro do alcance atual e seus vetores de movimento têm afinidade suficiente. A intensidade da linha expressa a força dessa relação. Sinais com três ou mais conexões recebem um anel discreto de contraste.

O ponteiro altera localmente o alcance e o limiar de afinidade das relações próximas. Nenhum ponto é empurrado ou arrastado. Dois controles alteram as mesmas condições em todo o campo. A ausência de conexão é um resultado válido.

As órbitas continuam em fases diferentes. Com isso, conexões podem surgir, persistir por algum tempo e desaparecer, sem um estado final. A pausa congela uma observação; não resolve o sistema.

## 4. Ciclo de uma observação

1. Cada sinal calcula sua posição e direção a partir do tempo.
2. Cada par próximo é testado por distância e alinhamento.
3. O ponteiro amplia localmente o campo de relações, sem mover os sinais.
4. O sistema desenha linhas, pontos e anéis conforme o resultado.
5. A pessoa altera um parâmetro, pausa ou move o ponteiro e compara a leitura.

## 5. Parâmetros

- **Alcance**: aumenta ou reduz a distância máxima para uma relação.
- **Afinidade**: altera o quanto as direções precisam concordar.
- **Ponteiro**: cria uma influência local e temporária em torno de uma posição.
- **Movimento**: permite comparar uma rede em transformação com um estado congelado.

## 6. O que observar

- Como alcance e afinidade alteram densidade e legibilidade.
- Se a estrutura percebida vem das conexões temporárias ou apenas da distribuição inicial dos pontos.
- Quando a densidade produz ruído em vez de significado.
- Como o campo local do ponteiro torna uma relação visível sem mover os sinais.

## 7. Limites e próximos testes

Os sinais seguem trajetórias predefinidas, embora as conexões sejam emergentes. Os limiares são heurísticos, não uma medida científica de percepção. A próxima iteração pode testar outras regras de direção e incluir uma forma de comparar estados do campo lado a lado.
