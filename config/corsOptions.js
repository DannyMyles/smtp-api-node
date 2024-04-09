const whitelist = [
    'http://localhost:5000',
    'http://localhost:4200',
    'http://localhost:3000'
  ]
  const corsOptions = {
    origin: function(origin, callback) {
      if (whitelist.indexOf(origin)!== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200 
  }
  module.exports = corsOptions