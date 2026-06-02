const soloRol = (...roles) => (req, res, next) => {
  if (!roles.includes(req.usuario.rol))
    return res.status(403).json({ mensaje: 'Acceso no autorizado' });
  next();
};

module.exports = { soloRol };
