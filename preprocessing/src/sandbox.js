// Just getting the hang of testing in JS

var config = require('../config/' + (process.env.NODE_ENV || 'development'))

export default(num) => {
  return ((num + 1) + config.additional)
}
