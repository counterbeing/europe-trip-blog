var assert = require('assert')
import onePlus from '../lib/sandbox'

describe('onePlus', function() {
  describe('with env vars', function() {
    it('should return 20 when given 1', function() {
      let result = onePlus(1)
      assert.equal(result, 102)
    })
  })
})
