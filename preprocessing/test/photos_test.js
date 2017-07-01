import assert from 'assert'
import fs from 'fs-extra'
import Photo from '../lib/photo'
import expect from 'expect'

describe('Photo', function() {
  describe('constructor', function() {
    let metadata = {
      'relativePath': 'monastary-hike-out.jpg',
      'uuid': 'b5b0c893-6c05-4977-b1e2-f51983cd422a',
      'title': 'Monastary hike out',
      'imageWidth': '2448',
      'imageHeight': '3264',
      'caption': 'On our way back from Monastary for some cragging, we witnissed our first Kalymnos sunset.',
      'latitude': 36.96542222,
      'longitude': 26.92809722,
      'createdAt': '2017-05-07T22:00:00.000Z',
      'dateCreated': '2017-05-07',
      'phash': '5f08e701e701e8e0'
    }

    it('loads an existing photo object without processing it', function() {
      let photo = new Photo(metadata)
      expect(photo.metadata).toEqual(metadata)
      expect(photo.processed).toEqual(true)
    })

    it('formats for export', function() {
      let photo = new Photo(metadata)
      let expected = {
        type: 'photo',
        id: 'b5b0c893-6c05-4977-b1e2-f51983cd422a',
        attributes:
        { filename: 'monastary-hike-out.jpg',
          title: 'Monastary hike out',
          caption: 'On our way back from Monastary for some cragging, we witnissed our first Kalymnos sunset.',
          latitude: 36.96542222,
          longitude: 26.92809722,
          'created-at': '2017-05-07T22:00:00.000Z',
          'date-created': '2017-05-07',
        }
      }
      let actual = photo.formatForExport()
      expect(actual).toEqual(expected)
    })
  })

  beforeEach(function () {
    fs.removeSync('test/tmp')
    fs.copySync(
      'test/fixtures/single_new_photo/',
      'test/tmp'
    )
  })

  it('combines into master metadata all other objects', function() {
    var photo = new Photo('test/tmp/IMG_0150.jpg')
    return photo.extractData().then(function() {
      assert.equal(photo.metadata.phash, 'f8c0c525a383c1f0')
      assert.equal(photo.metadata.title, 'Chilling on the Ferry')
    })
  })

  it('gathers exif data', function() {
    var photo = new Photo('test/tmp/IMG_0150.jpg')
    return photo.exifData().then(function(result) {
      assert.equal(result.title, 'Chilling on the Ferry')
      assert.equal(result.latitude, '36.95831667')
      assert.equal(result.imageWidth, '1900')
      assert.equal(result.relativePath, 'chilling-on-the-ferry.jpg')
      assert.equal(result.createdAt.format(), '2017-05-08T11:15:03Z')
    })
  })

  it('processes the photo', function() {
    this.timeout(5000)
    var photo = new Photo('test/tmp/IMG_0150.jpg')
    assert.equal(undefined, photo.processed)
    return photo.process().then(function() {
      assert.equal(true, photo.processed)
      assert.equal(true, fs.pathExistsSync(
        'test/tmp/2017-05-08/thumb/chilling-on-the-ferry.jpg'
      ))
    })
  })
})
