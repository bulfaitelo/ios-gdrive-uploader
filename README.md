# 📲 Upload Invisível: iOS (Apple Shortcuts) para Google Drive

Solução definitiva para enviar fotos, vídeos e documentos do iPhone/iPad ou Mac diretamente para uma pasta do Google Drive com 1 toque na Folha de Compartilhamento, sem depender das ações nativas do app do Drive e sem pop-ups na tela.

## 🛠️ Como Configurar

### Passo 1: Google Apps Script
1. Acesse o [Google Apps Script](https://script.google.com/) e crie um **Novo Projeto**.
2. Apague o código padrão e cole o conteúdo do arquivo `Code.gs`.
3. Altere a variável `MEU_TOKEN_SECRETO` criando uma senha própria.
4. Abra a pasta desejada no seu Google Drive, copie o código final da URL (depois de `/folders/`) e cole na variável `ID_PASTA_DESTINO`.
5. No topo direito, clique em **Implantar > Nova implantação**.
6. Selecione o tipo **App da Web**:
   - **Executar como:** Eu
   - **Quem tem acesso:** Qualquer pessoa
7. Conceda as permissões da sua conta Google (Avançado > Acessar projeto não seguro) e copie a **URL do App da Web** gerada.

---

### Passo 2: Configurando o Atalho no iOS
1. Baixe o template do Atalho neste link: `[COLE_SEU_LINK_DO_ICLOUD_AQUI]` *(ou monte manualmente seguindo o vídeo)*.
2. Na ação **Codificar em Base64**, certifique-se de que a opção **Quebras de Linha (Line Breaks)** está marcada como **Nenhuma (None)**.
3. Na ação **Dicionário**, preencha:
   - `token`: A mesma senha que você colocou no script.
   - `fileName`: Variável mágica apontando para o Nome da *Entrada do Atalho*.
   - `mimeType`: `application/octet-stream`
   - `fileData`: A saída do bloco *Codificar em Base64*.
4. Na ação **Obter Conteúdos da URL**:
   - Cole a URL do seu script (`/exec`).
   - Método: `POST`
   - Corpo da Requisição: **Arquivo** (Apontando para a variável do *Dicionário*).

---

## Link para download do Shortcut:
https://www.icloud.com/shortcuts/865e5a21709245f99a3bc47d4d67c1e0

## Link do vídeo tutorial:
https://www.youtube.com/watch?v=cs1JjonpbIM

---

### 💻 Testando via Terminal (macOS / Linux)
Caso queira testar o seu endpoint antes de montar no iPhone, rode no terminal:

```bash
b64=$(base64 -i "/caminho/do/arquivo.pdf" | tr -d '\n')

curl -L -X POST -H "Content-Type: application/json" \
-d '{"token":"SUA_SENHA_AQUI", "fileName":"arquivo.pdf", "mimeType":"application/pdf", "fileData":"'"$b64"'"}' \
"SUA_URL_DO_APPS_SCRIPT_AQUI"
