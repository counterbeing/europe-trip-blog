import assert from 'assert'
import fs from 'fs-extra'
import Photo from '../lib/photo'
// const fs = require('fs-extra')

// import sinon from 'sinon'


describe.only('Photo', function() {
  beforeEach(function () {
    fs.copySync(
      'test/fixtures/public',
      'test/tmp/public'
    )
  })


  it('does a thing', function() {
    var photo = new Photo
    assert.equal(photo.title(), 'hi there')
  })
})
