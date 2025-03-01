// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: 'Header de autorização não fornecido' 
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Formato de token inválido. Use: Bearer <token>' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Token não fornecido' 
      });
    }

    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Determina o role com base no isAdmin
    const userRole = decoded.isAdmin ? 'fisioterapeuta' : 'utente';
    
    // Armazena os dados do usuário, incluindo o role determinado
    req.user = {
        id: decoded.id,
        email: decoded.email,
        nome: decoded.nome,
        isAdmin: decoded.isAdmin,
        role: userRole
    };
    
    
    if (userRole === 'utente') {
        req.utente = req.user;
    } else if (userRole === 'fisioterapeuta') {
        req.fisioterapeuta = req.user;
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expirado' 
      });
    }
    
    return res.status(401).json({ 
      success: false,
      message: 'Token inválido' 
    });
  }
};

module.exports = authMiddleware;