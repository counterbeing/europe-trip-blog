import assert from 'assert'
import fs from 'fs-extra'
import Photo from '../lib/photo'

describe('Photo', function() {
  it('loads an existing photo object without processing it', function() {
    let metadata = {
      'relativePath': 'monastary-hike-out.jpg',
      'title': 'Monastary hike out',
      'imageWidth': '2448',
      'imageHeight': '3264',
      'caption': 'On our way back from Monastary for some cragging, we witnissed our first Kalymnos sunset.',
      'latitude': 36.96542222,
      'longitude': 26.92809722,
      'createdAt': '2017-05-07T22:00:00.000Z',
      'dateCreated': '2017-05-08',
      'phash': '5f08e701e701e8e0'
    }
    let photo = new Photo(metadata)
    assert.equal(metadata, photo.metadata)
    assert.equal(true, photo.processed)
  })

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
      assert.equal(result.latitude, '36.95831667')
      assert.equal(result.imageWidth, '1900')
      assert.equal(result.relativePath, 'chilling-on-the-ferry.jpg')
    })
  })

  it('processes the photo', function() {
    this.timeout(5000)
    var photo = new Photo('test/tmp/public/photos/IMG_0150.jpg')
    assert.equal(undefined, photo.processed)
    return photo.process().then(function() {
      assert.equal(true, photo.processed)
      assert.equal(true, fs.pathExistsSync(
        'test/tmp/public/photos/2017-05-08/thumb/chilling-on-the-ferry.jpg'
      ))
    })
  })
})
