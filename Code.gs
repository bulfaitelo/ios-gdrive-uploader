/**
 * ============================================================================
 * UPLOAD AUTOMÁTICO: APPLE SHORTCUTS (iOS/macOS) -> GOOGLE DRIVE
 * Canal: RM Info (@RMINFOSG)
 * ============================================================================
 * 
 * INSTRUÇÕES RÁPIDAS:
 * 1. Altere as variáveis MEU_TOKEN_SECRETO e ID_PASTA_DESTINO abaixo.
 * 2. Clique em "Implantar" > "Nova implantação".
 * 3. Escolha o tipo "App da Web".
 * 4. Em "Executar como", selecione "Eu" (seu e-mail).
 * 5. Em "Quem tem acesso", selecione "Qualquer pessoa" (Obrigatório!).
 * 6. Autorize o script na sua conta Google e copie a URL gerada (/exec).
 */

// 1. Defina uma senha forte. Você usará essa mesma senha no app Atalhos do iOS.
const MEU_TOKEN_SECRETO = "COLE_SUA_SENHA_FORTE_AQUI";

// 2. Cole o ID da pasta do Google Drive (o código que fica no final da URL da pasta).
const ID_PASTA_DESTINO = "COLE_O_ID_DA_SUA_PASTA_AQUI";

function doPost(e) {
  try {
    // Verifica se a requisição realmente enviou um corpo de dados
    if (!e || !e.postData || !e.postData.contents) {
      return responderJSON("erro", "Nenhum dado recebido na requisição POST.");
    }

    var payload = JSON.parse(e.postData.contents);

    // ========================================================================
    // VERIFICAÇÃO DE SEGURANÇA (TOKEN)
    // ========================================================================
    if (payload.token !== MEU_TOKEN_SECRETO) {
      return responderJSON("erro", "Acesso negado: Token de segurança inválido.");
    }

    // Validação básica dos campos obrigatórios
    if (!payload.fileData || !payload.fileName) {
      return responderJSON("erro", "Dados incompletos: 'fileData' ou 'fileName' ausentes.");
    }

    // ========================================================================
    // DECODIFICAÇÃO E CRIAÇÃO DO ARQUIVO NO GOOGLE DRIVE
    // ========================================================================
    var mimeType = payload.mimeType || "application/octet-stream";
    var decodedData = Utilities.base64Decode(payload.fileData);
    var fileBlob = Utilities.newBlob(decodedData, mimeType, payload.fileName);

    var folder = DriveApp.getFolderById(ID_PASTA_DESTINO);
    var file = folder.createFile(fileBlob);

    // Retorna sucesso e a URL direta do arquivo criado
    return responderJSON("sucesso", "Upload concluído!", {
      fileName: file.getName(),
      fileId: file.getId(),
      url: file.getUrl()
    });

  } catch (err) {
    // Em caso de falha interna (ID de pasta errado, Base64 corrompido, etc.)
    return responderJSON("erro", "Erro interno no script: " + err.toString());
  }
}

/**
 * Função auxiliar para padronizar o retorno em JSON para o Apple Shortcuts
 */
function responderJSON(status, mensagem, dadosExtras) {
  var resposta = {
    status: status,
    detalhe: mensagem
  };

  if (dadosExtras) {
    for (var chave in dadosExtras) {
      resposta[chave] = dadosExtras[chave];
    }
  }

  return ContentService.createTextOutput(JSON.stringify(resposta))
    .setMimeType(ContentService.MimeType.JSON);
}