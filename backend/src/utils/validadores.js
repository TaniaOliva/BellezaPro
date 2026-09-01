const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const esEmailValido = (email) => typeof email === 'string' && EMAIL_REGEX.test(email.trim());

module.exports = { esEmailValido, EMAIL_REGEX };
