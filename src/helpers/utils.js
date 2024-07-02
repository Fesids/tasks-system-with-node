
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtExpiry } = require('./constants.js');

const sendResponse = (res, statusCode, message, result = [], error = {}) => {
  res.status(statusCode).json({
    statusCode,
    message,
    data: result,
    error,
  });
};

const validate = {
  password: (str) => {
    const regex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    return str.length >= 5 && regex.test(str);
  },
};

const isAvailable = (targetObj, requiredFieldsArr, checkForAll = true) => {
  const targetKeysArr = Object.keys(targetObj);
  let match;
  if (checkForAll) match = requiredFieldsArr.every((field) => targetKeysArr.includes(field));
  else match = requiredFieldsArr.some((field) => targetKeysArr.includes(field));
  return match;
};

const getHashPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

const verifyUserPassword = async (plainTextPassword, hashPassword) => {
  const validation = await bcrypt.compare(plainTextPassword, hashPassword);
  return validation;
};

const getJwtToken = (jwtPayload) => jwt.sign(
  {
    usuarioId: jwtPayload.usuarioId,
    nome: jwtPayload.nome,
    cargo: jwtPayload.cargo,
    setor: jwtPayload.setor,
    supervisionado_por: jwtPayload.supervisionado_por
  },
  process.env.JWT_SECRET,
  { expiresIn: jwtExpiry }
);

const saveCookie = (res, key, value) => res.cookie(key, value, { httpOnly: true, maxAge: jwtExpiry * 1000 });

const verifyJwtToken = (token) => {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  return decodedToken;
};

module.exports = {
  sendResponse,
  validate,
  isAvailable,
  getHashPassword,
  verifyUserPassword,
  getJwtToken,
  saveCookie,
  verifyJwtToken,
};
