if (process.env.NODE_ENV === 'test') {
    module.exports = {
      JWT_SECRET: 'codeworkrauthentication',
      oauth: {
        google: {
          clientID: '605380756997-nqsktnia1c35t6h40sp054sdloojkfar.apps.googleusercontent.com',
          clientSecret: 'N775gkmwBaU3K5uqYM9dZJJe',
        },
      
      },
    };
  } else {
    module.exports = {
      JWT_SECRET: 'codeworkrauthentication',
      oauth: {
        google: {
          clientID: 'number',
          clientSecret: 'string',
        },
       
      },
    };
  }
  