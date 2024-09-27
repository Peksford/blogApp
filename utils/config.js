require('dotenv').config();

const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONTODB_URI
    : process.env.MONGODB_URI;

module.exports = {
  MONGODB_URI,
};
