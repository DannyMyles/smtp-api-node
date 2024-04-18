// const whitelist = [
  
//     'http://localhost:5000',
//     'http://localhost:4200',
//     'http://localhost:3000'
//   ]
//   const corsOptions = {
//     origin: function(origin, callback) {
//       if (whitelist.indexOf(origin)!== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true,
//     optionsSuccessStatus: 200 
//   }
//   module.exports = corsOptions
const corsOptions = {
  origin: function(origin, callback) {
    // Check if the origin is allowed (you can perform additional checks if needed)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      // Allow the request
      callback(null, true);
    } else {
      // Block the request
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200 
};

module.exports = corsOptions;
