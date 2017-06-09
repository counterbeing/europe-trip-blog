var assert = require('assert')
import onePlus from '../lib/sandbox'

describe('onePlus', function() {
  it('should return 2 when given 1', function() {
    let result = onePlus(1)
    assert.equal(2, result)
  })
})
