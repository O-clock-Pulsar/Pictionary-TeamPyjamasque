import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const socketAddressHTTP = process.env.SOCKET_IO_ADDRESS_HTTP_PROTOCOL ? process.env.SOCKET_IO_ADDRESS_HTTP_PROTOCOL : 'http://localhost';
const socketAddressWS = process.env.SOCKET_IO_ADDRESS_WS_PROTOCOL ? process.env.SOCKET_IO_ADDRESS_WS_PROTOCOL : 'ws://localhost';

export default helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      reportUri: '/report-violation',
      styleSrc: ["'self'", 'fonts.googleapis.com'],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
      scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
      connectSrc: ["'self'",
        `${socketAddressHTTP}`,
        `${socketAddressWS}`],
    },
  },
  hidePoweredBy: {
    setTo: 'PHP 7.3.6',
  },
  permittedCrossDomainPolicies: {
    permittedPolicies: 'none',
  },
  referrerPolicy: {
    policy: 'same-origin',
  },
  xssFilter: {
    reportUri: '/report-violation',
  },
});
