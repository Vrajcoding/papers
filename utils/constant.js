module.exports = {
    JWT_SECRET : process.env.JWT_SECRET,
    TOKEN_EXPIRY : '1h',
    SALT_ROUND : 10,
    SESSION_SECRET : process.env.SESSION_SECRET
};