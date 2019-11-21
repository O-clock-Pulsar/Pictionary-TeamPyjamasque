import helmet from 'helmet';

export default helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      reportUri: '/report-violation',
      styleSrc: ["'self'", 'fonts.googleapis.com'],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
      imgSrc: ["'self'", 'www.w3.org'],
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
