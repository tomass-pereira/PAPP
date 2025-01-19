const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Erro de validação',
        errors: Object.values(err.errors).map(error => error.message)
      });
    }
  
    if (err.code === 11000) {
      return res.status(400).json({
        message: 'Dados duplicados',
        field: Object.keys(err.keyPattern)[0]
      });
    }
  
    res.status(500).json({
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  };
  
  module.exports = errorMiddleware;