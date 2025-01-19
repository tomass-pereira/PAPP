const validateUserData = (req, res, next) => {
    const { email, nome, telefone, senha } = req.body;
  
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Email inválido' });
    }
  
    if (!nome || nome.length < 3) {
      return res.status(400).json({ message: 'Nome deve ter pelo menos 3 caracteres' });
    }
  
    if (!telefone || !/^\d{9}$/.test(telefone)) {
      return res.status(400).json({ message: 'Telefone deve ter 9 dígitos' });
    }
  
    if (!senha || senha.length < 6) {
      return res.status(400).json({ message: 'Senha deve ter pelo menos 6 caracteres' });
    }
  
    next();
  };
  
  module.exports = validateUserData;