# fael.tech Lab

Um corpo público de trabalho para projetos, pesquisas e experimentos. Este repositório começa com o Study 001, **Signal Structure**.

## Como ler este estudo

O projeto é pequeno de propósito. A leitura recomendada acompanha o fluxo da experiência:

1. Leia `docs/study.md` para entender a pergunta, a hipótese e o que observar.
2. Leia `src/sketch/signal.ts` para ver como um sinal nasce e se move.
3. Leia `src/sketch/rules.ts` para ver quando dois sinais formam uma relação.
4. Leia `src/sketch/system.ts` para acompanhar a renderização dessas regras.
5. Leia `src/main.ts` para entender a ponte entre a página, os controles e o estudo.
6. Consulte `docs/decisions/` para as decisões que mantêm essa forma de construção.

Cada módulo segue a mesma pergunta didática: qual é sua responsabilidade, quais
dados recebe, que transformação realiza e que efeito torna observável?

## Executar

Requer Node.js 20.19+.

```sh
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite. Para gerar a versão estática:

```sh
npm run build
```

O resultado em `dist/` pode ser servido por qualquer hospedagem estática. Não há backend.

## Modelo mental

O estudo separa quatro camadas: sinais têm posições e direções; regras avaliam
pares de sinais; o sistema desenha o resultado; a página oferece controles e
texto. O fluxo de cada frame é:

`tempo -> movimento dos sinais -> avaliação das relações -> desenho -> contagem`

O código comenta as decisões que não são evidentes pela sintaxe. Esses
comentários explicam o modelo e os limites do estudo, sem repetir cada linha.

## Estrutura do código

- `src/sketch/signal.ts`: sinais e movimento independente.
- `src/sketch/rules.ts`: regras de relação e influência local do campo.
- `src/sketch/system.ts`: renderização p5 e ciclo de vida.
- `src/main.ts`: controles da página e API de integração.
- `docs/study.md`: hipótese, observações e próximos experimentos.

## Documentação do projeto

- `docs/study.md`: guia do fenômeno, do ciclo de execução e da observação.
- `docs/decisions/001-foundation.md`: escolhas técnicas e visuais da fundação.
- `docs/decisions/002-didactic-structure.md`: decisão de tornar código e documentação legíveis pelo mesmo percurso.

## Integração

O estudo usa p5 em modo de instância dentro de `#sketch`, sem alterar conteúdo externo. O objeto `window.signalStructure` expõe `setField({ reach, affinity })`, `setMotion(boolean)` e `destroy()`. Os valores de `reach` e `affinity` variam de 0 a 1. A página mantém texto e um campo visual estático em CSS sem JavaScript. Com `prefers-reduced-motion`, o estudo inicia parado e pode ser retomado pelo controle.
