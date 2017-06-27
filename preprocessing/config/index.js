var config = require('./' + (process.env.NODE_ENV || 'development'))
//require('./default')
// Object.assign(config, default)
module.exports = config
