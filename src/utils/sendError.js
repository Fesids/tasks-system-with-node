// sendError.js

/**
 * Padroniza as responses de Erro.
 * @param {number} statusCode - Codigo HTTP.
 * @param {string} status - Status do erro (e.g., 'fail', 'error').
 * @param {string} message - Mensagem detalhada do erroo.
 */
const sendError = (statusCode, status, message) => {
    return {
      statusCode,
      status,
      message,
    };
  };
  
module.exports = sendError;
  