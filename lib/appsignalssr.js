const { Appsignal } = require('@appsignal/nodejs');

exports.appsignalssr =
  !global.window &&
  new Appsignal({
    active: true,
    name: 'backend',
    apiKey: process.env.NEXT_PUBLIC_APPSIGNAL_SSR_KEY,
    environment: process.env.NEXT_PUBLIC_NODE_ENV,
    debug: true
  });
