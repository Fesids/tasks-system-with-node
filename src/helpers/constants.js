const STATUS_CODES = {
    OK: 200,
    SUCCESSFULLY_CREATED: 201,
    REDIRECT: 302,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
  };
  
  
  const userAuthRequiredFields = {
    nome: 'nome',
    email: 'email',
    senha: "senha"
  };

  const userLoginRequiredFields = {
    email: 'email',
    senha: "senha"
  };

  const userUpdateFields = {
    nome: 'nome',
    sobrenome: 'sobrenome'
  };

  const cargoCreateFields = {
    nome: 'nome'
  };

  const setorCreateFields = {
    nome: 'nome'
  };

  const taskCreateFields = {
    usuario_id : "usuario_id", 
    assunto : "assunto", 
    content_type : "content_type", 
    content : "content", 
    setor: "setor" 
  }

  const dbErrorCodes = {
    ER_DUP_ENTRY: 'ER_DUP_ENTRY'
  };

  // jwt expiry
const jwtExpiry = 1 * 60 * 60;

// attribute for the cookie to be created to save the jwt token
const cookieAttributeForJwtToken = 'jwt_token';


module.exports = {
  STATUS_CODES, userAuthRequiredFields, 
  userLoginRequiredFields, userUpdateFields, cargoCreateFields,
  setorCreateFields, taskCreateFields,
  dbErrorCodes, jwtExpiry, cookieAttributeForJwtToken
}