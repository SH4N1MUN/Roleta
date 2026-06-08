# Roleta Erotica: Progressao Sensorial

PWA privada para adultos, com roleta sensorial adaptativa, historico local, filtros de limites e modo offline.

## Aviso

Conteudo destinado exclusivamente a maiores de 18 anos. Use apenas em contexto consensual e privado.

## Rodar localmente

```bash
python -m http.server 4192 --bind 127.0.0.1
```

Depois acesse:

```text
http://127.0.0.1:4192/
```

## Antes de publicar

Otimize as imagens sempre que trocar arquivos dentro de `assets`:

```bash
python tools/optimize-assets.py
```

O script mantem os mesmos nomes e caminhos, mas reduz os JPEGs para tamanhos adequados para navegador/PWA.

## Publicar no GitHub Pages

1. Suba os arquivos para um repositorio.
2. Em `Settings > Pages`, selecione a branch principal e a pasta raiz.
3. Abra a URL publicada e instale pelo navegador.

O app usa caminhos relativos (`./`), entao funciona tanto localmente quanto em GitHub Pages dentro de subpasta.

## PWA

- `manifest.json` com icones PNG reais e maskable icons.
- `service-worker.js` guarda o shell principal e cacheia assets sob demanda.
- Funciona offline depois do primeiro carregamento completo.

## Privacidade

O estado da sessao fica no navegador via `localStorage`. Nao ha backend.
