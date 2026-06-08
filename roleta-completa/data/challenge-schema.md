# Challenge Bank Schema

Arquivo de manutencao: `data/challenges.js`.

Campos principais:

- `id`: string unica e estavel. Ex.: `r4-couple-strip-01`.
- `rank`: numero de 1 a 7.
- `mode`: `couple`, `solo`, `both` ou omitido para casal legado.
- `title`: nome curto exibido no modal.
- `text`: texto do desafio com tokens suportados pelo app.
- `seconds`: duracao do timer em segundos; use `0` para sem timer.
- `insight`: `true` quando o desafio deve perguntar se o corpo ja esta no ponto.
- `actorPreset`: `feminine` ou `masculine`, quando so um perfil pode iniciar.
- `receiverPreset`: `feminine` ou `masculine`, quando so um perfil pode receber.
- `actorTarget`: opcional; `current`, `other`, `female` ou `male` quando o executor real nao deve ser a vez atual.
- `receiverTarget`: opcional; `current`, `other`, `female` ou `male` quando o alvo real nao deve ser a outra pessoa da vez atual.
- `requiresFemale`: `true` quando a sessao precisa ter uma participante feminina.
- `requiresMale`: `true` quando a sessao precisa ter um participante masculino.
- `requiresMixedPair`: `true` quando o texto pressupoe casal feminino/masculino.
- `turnMode`: `mutual` para desafios de troca do casal.
- `seductionFlow`: `true` para desafios de Rank 1 usados pelo aprendizado local.
- `insightTarget`: opcional; `actor`, `receiver`, `female` ou `couple` para decidir quem aparece no texto "entrou no clima".
- `learningTags`: lista de tags heuristicas para ajustar pesos.
- `loop`: `true` apenas para recuos estrategicos.
- `phaseVariant`: subfase invisivel usada principalmente no Rank 6. Valores: `sensory`, `guided`, `direct`, `edge`, `retreat`, `mutual`, `display`.
- `requiredItems`: lista de itens necessarios para o desafio entrar. Valores: `lubricant`, `massageOil`, `vibrator`, `analToy`, `camera`.
- `receiverLimits`: lista de limites pessoais que bloqueiam o desafio quando marcados pelo receptor. Valores: `anal`, `throat`, `impact`, `recording`.
- `actorLimits`: lista de limites pessoais que bloqueiam o desafio quando marcados pelo executor.
- `blockedByLimits`: lista de limites que bloqueiam o desafio se qualquer participante marcou.

Ordem e papeis:

- A sessao sorteia a primeira vez uma vez so; depois `advanceTurn()` alterna a ordem.
- `actorPreset` e `receiverPreset` filtram o pool de acordo com a vez resolvida antes do sorteio.
- Se o pool da vez atual zerar, o app tenta a outra vez antes de dizer que acabaram os desafios disponiveis.
- Prefira `{actor}` e `{receiver}` em desafios de acao.
- Use `{female_partner}` e `{other_partner}` apenas em desafios `turnMode: "mutual"` ou quando houver metadado claro, como `requiresFemale`, presets ou targets.

Continuidade temporal:

- Desafios que dependem de roupa, roupa intima, strip, nudez ou pecas removiveis devem ter regra correspondente em `CLOTHING_RULES`, em `app.js`.
- Use essas regras para declarar pre-condicoes (`before`, `atLeast`, `anyBefore`, `anyAtLeast`) e efeitos (`effects`).
- A roleta usa piso e teto temporal: depois de manual/oral/penetracao, desafios iniciais demais deixam de entrar no fallback; antes de exposicao suficiente, ranks avancados ficam bloqueados.
- Para regras baseadas em `actor` ou `receiver`, o app usa os papeis resolvidos do desafio, nao apenas a vez atual.
- No Rank 6, prefira `phaseVariant` para separar oral sensorial, guiado, direto, limite, recuo, mutuo ou exibicao sem criar novas fatias na roleta.
- Para desafios com anal, garganta, impacto, gravacao ou itens especificos, declare os campos de preferencia acima. O app tambem tenta inferir por texto, mas metadados explicitos sao mais confiaveis.

Antes de publicar, rode:

```powershell
& 'C:\Users\nerdt\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\tools\validate-challenges.js
```
