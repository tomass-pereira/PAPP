const { genSalt, hash, compare } = require('bcryptjs');

// Função para criar hash da senha
const hashPassword = async (password) => {
  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
};

// Função para verificar a senha
const verifyPassword = async (password, hashedPassword) => {
  const isMatch = await compare(password, hashedPassword);
  return isMatch;
};
module.exports = { hashPassword, verifyPassword };