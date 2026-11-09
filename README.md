# Altar Loops Studio - Backup Completo + Renderizador de Vídeo em Alta Qualidade

Este repositório contém uma duplicação completa (backup) e funcional do **Altar Loops Studio** (`https://www.altarloops.com/studio`), com a adição de um **Renderizador de Vídeo em Alta Qualidade nativo no navegador** (MP4 / WebM em 4K, 2K, 1080p, 720p ou proporções personalizadas).

---

## 🚀 Como Iniciar o Site Localmente

### Opção 1: Arquivo Batch (1 Clique no Windows)
Basta dar duplo clique no arquivo:
`start-studio.bat`

Ele iniciará o servidor local e abrirá automaticamente seu navegador em `http://localhost:3000/studio`.

### Opção 2: Via Terminal (Node.js)
```bash
cd "C:\Users\pinhe\.gemini\antigravity\scratch\altarloops-backup"
node server.js
```
Em seguida, abra no navegador:
`http://localhost:3000/studio`

*(O site também pode ser hospedado diretamente em qualquer hospedagem estática como Vercel, Netlify, GitHub Pages ou servidor Nginx/Apache).*

---

## 🎬 Nova Função: Renderizador de Vídeo em Alta Qualidade

Originalmente, o site apenas oferecia um preview WebGL em baixa resolução e pedia para o usuário usar um aplicativo externo pago ("Altar Render"). 

Agora, foi adicionado o botão **"Render Video (HD/4K)"** diretamente no painel de ações ("Keep"), permitindo exportar o loop com fidelidade máxima:

### ✨ Recursos do Renderizador:
1. **Resoluções Selecionáveis:**
   - **4K Ultra HD** (3840 × 2160)
   - **2K QHD** (2560 × 1440)
   - **1080p Full HD** (1920 × 1080)
   - **720p HD** (1280 × 720)
   - **Tamanho Atual da Tela** (utiliza a proporção e resolução da aba *Screen*)
   - **Resolução Personalizada** (largura e altura customizadas para painéis de LED ou paredes ultra-wide)

2. **Taxa de Quadros (FPS):**
   - **60 FPS** (Ultra Suave – ideal para ProPresenter, Resolume e projeções)
   - **30 FPS** (Transmissão padrão)
   - **24 FPS** (Cinematográfico)

3. **Taxa de Bits / Qualidade:**
   - **Master / Pro** (~50 Mbps)
   - **High Quality** (~25 Mbps)
   - **Standard** (~12 Mbps)

4. **Renderização Determinística Perfeita:**
   - O renderizador calcula quadro a quadro com base na fase exata $\theta \in [0, 2\pi]$ do loop.
   - **Zero perda de quadros** (zero frame drops) e emenda de loop 100% perfeita e contínua.
   - Utiliza a aceleração por hardware da GPU via **WebCodecs API** (`VideoEncoder`) combinada com o **Mp4Muxer** para gerar arquivos `.mp4` padrão diretamente no navegador.
   - Possui fallback automático para `MediaRecorder` caso executado em navegadores mais antigos.

5. **Interface em Tempo Real:**
   - Barra de progresso animada.
   - Contagem exata de quadros processados (ex: `Frame 320 / 600 (53%)`).
   - Estimativa de tempo restante (ETA).
   - Mini-preview em tempo real dos quadros sendo renderizados.
   - Player de vídeo integrado ao concluir para reprodução imediata e botão de download direto.

---

## 📁 Estrutura dos Arquivos

- `index.html`: Página principal do Loop Studio com os controles, abas e WebGL canvas.
- `studio.js`: Motor WebGL de shaders de iluminação, movimento, acabamento e paleta.
- `render-video.js`: Módulo completo do Renderizador de Vídeo em Alta Qualidade e modal interativo.
- `mp4-muxer.min.js`: Biblioteca de empacotamento MP4 (H.264/AVC) de alta performance.
- `styles.css`: Estilização completa do estúdio e temas.
- `text-fx.js`: Sistema de efeitos de texto sobreposto.
- `scripture.js`: Sistema de tipografia bíblica e versículos.
- `app.js`: Cabeçalho, navegação e interações globais.
- `site.json` & `catalog.json`: Estrutura de catálogo e configurações.
- `brand/`: Logos e favicons do Altar Loops.
- `thumbs/`: Cache com todas as 441 miniaturas de Looks e Acabamentos (Finishes) para funcionamento offline completo.
- `server.js`: Servidor HTTP ultraleve em Node.js com endpoints mock da API.
- `start-studio.bat`: Inicializador de um clique para Windows.
