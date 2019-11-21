import helmet from 'helmet';

export default helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      reportUri: '/report-violation',
      styleSrc: ["'self'", 'fonts.googleapis.com'],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
      scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
      connectSrc: ["'self'",
        process.env.SOCKET_IO_ADDRESS_WS_PROTOCOL || 'ws://localhost:5060',
        process.env.SOCKET_IO_ADDRESS_HTTP_PROTOCOL || 'http://localhost:5060'],
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
