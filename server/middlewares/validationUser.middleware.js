const validateUserData = (req, res, next) => {
  const { email, nome, telefone, senha, dataNascimento} = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Email inválido' });
  }

  if (!nome || nome.length < 3) {
    return res.status(400).json({ message: 'Nome deve ter pelo menos 3 caracteres' });
  }

  if (!telefone || !/^\d{9}$/.test(telefone)) {
    return res.status(400).json({ message: 'Telefone deve ter 9 dígitos' });
  }

  if (senha.length < 6) {
    return res.status(400).json({ message: 'Senha deve ter pelo menos 6 caracteres' });
  }

  const birthDate = new Date(dataNascimento);
  if (!dataNascimento || isNaN(birthDate)) {
    return res.status(400).json({ message: 'Data de nascimento inválida' });
  }

  // Validação de idade mínima (18 anos)
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 18) {
    return res.status(400).json({ message: 'O usuário deve ter pelo menos 18 anos' });
  }

 

  // Verifica se a data dos sintomas é futura
  

  // Verifica se a data dos sintomas é anterior à data de nascimento
 

  next();
};

module.exports = validateUserData;