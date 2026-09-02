const mongoose = require('mongoose');

mongoose.connection.on('connected',    () => console.log('MongoDB conectado correctamente'));
mongoose.connection.on('error',        (e) => console.error('MongoDB error:', e.message));
mongoose.connection.on('disconnected', () => console.warn('MongoDB desconectado — el driver reintentará'));
mongoose.connection.on('reconnected',  () => console.log('MongoDB reconectado'));

const conectarDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bellezapro';
  await mongoose.connect(uri, {
    maxPoolSize: 10,
    minPoolSize: 1,
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 45000,
  });
};

module.exports = conectarDB;
