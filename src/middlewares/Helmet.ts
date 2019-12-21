import helmet from 'helmet';

export default (socketAddress: string) => {
  const socketAddressHTTP = socketAddress ? `http://${socketAddress}` : 'http://localhost';
  const socketAddressWS = socketAddress ? `ws://${socketAddress}` : 'ws://localhost';

  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        reportUri: '/report-violation',
        imgSrc: ["'self'", 'data:'],
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
};
