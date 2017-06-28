import assert from 'assert'
import sinon from 'sinon'
import photoQueries from '../lib/photo_queries'
import fs from 'fs-extra'

var metadata = [
  {
    'title': 'Chilling on the Ferry',
    'caption': 'A German couple was nice enough to snap our pic on the boat.',
    'phash': 'f8c0c525a383c1f0',
    'dateCreated': '2017-05-08',
  },
  {
    'title': 'Monastary hike out',
    'caption': 'On our way back from Monastary for some cragging, we witnissed our first Kalymnos sunset.',
    'phash': '5f08e701e701e8e0',
    'dateCreated': '2017-05-08',
  },
  {
    'title': 'Secret Garden from the Right',
    'caption': 'Another crag overview shot. Just as we were leaving we spotted a pod of dolphins which would probably be in frame in the ocean, but they can\'t be seen here.',
    'phash': '00fef8c0f070f0e0',
    'dateCreated': '2017-05-13',
  }
]

describe('running queries for json index generation', function() {
  var mock
  var expectation
  beforeEach(function () {
    var promise = new Promise(function(resolve) { return resolve('yay') })
    mock = sinon.mock(fs)
    expectation = mock.expects('writeJson')
    expectation.returns(promise)
  })
  afterEach(function(){
    mock.restore()
  })

  describe('run', function() {
    it('writes out all files', function() {
      expectation.exactly(4)
      return photoQueries.run(metadata).then(function() {})
    })
  })

  describe('masterIndex', function() {
    it('writes out all image files in flat format', function() {
      return photoQueries.masterIndex(metadata).then(function() {
        assert.equal(expectation.args[0][1].length, 3)
      })
    })
  })

  describe('masterIndex', function() {
    it('writes out all image files in JSONAPI', function() {
      return photoQueries.index(metadata).then(function() {
        assert.equal(expectation.args[0][1].data.length, 3)
      })
    })
  })

  describe('dateIndex', function() {
    it('writes out images for a specific date', function() {
      expectation.twice()
      return photoQueries.dateIndex(metadata).then(function() {
        assert.equal(expectation.args[0][1].data.length, 2)
        assert.equal(expectation.args[1][1].data.length, 1)
      })
    })
  })
})
