const Flutterwave = require('flutterwave-node-v3');

const publicKey = process.env.FLW_KEY_PUBLIC || process.env.FLW_PUBLIC_KEY;
const secretKey = process.env.FLW_KEY_SECRET || process.env.FLW_SECRET_KEY;
const encryptionKey = process.env.FLW_KEY_ENCRYPTION || process.env.FLW_ENCRYPTION_KEY;

const isConfigured = Boolean(publicKey && secretKey);

let flw = null;
if (isConfigured) {
  flw = new Flutterwave(publicKey, secretKey);
} else {
  console.warn('[flutterwave] FLW public/secret keys missing — payment endpoints will return 503');
}

module.exports = { flw, publicKey, secretKey, encryptionKey, isConfigured };
