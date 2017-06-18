import assert from 'assert'
import fs from 'fs-extra'
import Photo from '../lib/photo'
// import sinon from 'sinon'


describe.only('Photo', function() {
  beforeEach(function () {
    fs.copySync(
      'test/fixtures/public',
      'test/tmp/public'
    )
  })

  it('combines into master metadata all other objects', function() {
    var photo = new Photo('test/tmp/public/photos/IMG_0150.jpg')
    return photo.metaData().then(function(result) {
      assert.equal(result.phash, 'f8c0c525a383c1f0')
      assert.equal(result.title, 'Chilling on the Ferry')
    })
  })

  it('generates a phash for the image', function() {
    var photo = new Photo('test/tmp/public/photos/IMG_0150.jpg')
    return photo.phash().phash.then(function(result) {
      assert.equal(result, 'f8c0c525a383c1f0')
    })
  })

  it('gathers exif data', function() {
    var photo = new Photo('test/tmp/public/photos/IMG_0150.jpg')
    return photo.exifData().then(function(result) {
      assert.equal(result.title, 'Chilling on the Ferry')
      assert.equal(result.latitude, '36 deg 57\' 29.94" N')
      assert.equal(result.imageWidth, '1900')
      assert.equal(result.relativePath, 'chilling_on_the_ferry.jpg')
    })
  })
})
