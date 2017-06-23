import assert from 'assert'
import fs from 'fs-extra'
import Photo from '../lib/photo'
// import sinon from 'sinon'

describe('Photo', function() {
  beforeEach(function () {
    fs.removeSync('test/tmp')
    fs.copySync(
      'test/fixtures/public',
      'test/tmp/public'
    )
  })

  it('combines into master metadata all other objects', function() {
    var photo = new Photo('test/tmp/public/photos/IMG_0150.jpg')
    return photo.extractData().then(function() {
      assert.equal(photo.metadata.phash, 'f8c0c525a383c1f0')
      assert.equal(photo.metadata.title, 'Chilling on the Ferry')
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

  it('processes the photo', function() {
    this.timeout(5000)
    var photo = new Photo('test/tmp/public/photos/IMG_0150.jpg')
    return photo.process().then(function() {
      assert.equal(true, fs.pathExistsSync(
        'test/tmp/public/photos/2017-05-08/thumb/chilling_on_the_ferry.jpg'
      ))
    })
  })
})
