# 002 - Estrutura didática do lab

## Contexto

O estudo tem uma arquitetura pequena e intencional, mas sua lógica estava mais
fácil de executar do que de ensinar. Os módulos já separavam movimento, regras,
renderização e controles; a documentação, porém, apresentava essas ideias em
blocos independentes, sem conduzir a leitura entre hipótese, código e
observação.

## Decisão

Código e documentação passam a compartilhar o mesmo percurso didático:

1. declarar a responsabilidade da parte;
2. nomear os dados que entram;
3. explicar a transformação principal;
4. relacionar a transformação ao efeito observável;
5. registrar limites e próximos experimentos.

Comentários no código explicam decisões e relações entre camadas, não cada
linha. O README funciona como índice de leitura, `study.md` descreve o sistema
como um experimento e as decisões registram por que a estrutura foi escolhida.

## Consequências

- Uma pessoa nova consegue sair da hipótese e chegar ao módulo responsável sem
  depender de conhecimento prévio de p5.
- Os comentários tornam explícito o ciclo `tempo -> movimento -> relações -> desenho`.
- A documentação pode crescer junto com novos estudos sem virar uma lista de
  detalhes de implementação.
- A clareza depende de manter comentários próximos das decisões reais; eles
  devem ser atualizados quando uma regra ou limite mudar.
