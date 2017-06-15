import assert from 'assert'
// import fs from 'fs-extra'
const fs = require('fs-extra')

// import sinon from 'sinon'


describe.only('Photo', function() {
  beforeEach(function () {
    fs.copySync(
      'test/fixtures/public',
      'test/tmp/public'
    )
    // .then(() => console.log('success!'))
    // .catch(err => console.error(err))
  })

  // afterEach(function(){
  // })


  it('does a thing', function() {
    assert.equal(1,1)
  })
})
