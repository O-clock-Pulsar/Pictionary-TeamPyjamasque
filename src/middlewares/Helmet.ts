import helmet from 'helmet';

export default helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      reportUri: '/report-violation',
    }
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
  }
});
