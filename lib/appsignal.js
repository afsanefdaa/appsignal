import Appsignal from '@appsignal/javascript';

const appsignal = !!global.window &&
  new Appsignal({
    name: 'frontend',
    key: process.env.NEXT_PUBLIC_APPSIGNAL_KEY,
    environment: process.env.NEXT_PUBLIC_NODE_ENV
  });

export default appsignal;
