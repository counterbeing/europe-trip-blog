import assert from 'assert'
import sinon from 'sinon'
import jsonWriter from '../lib/json_writer'
import photoQueries from '../lib/photo_queries'

var metadata = [
  {
    'title': 'Chilling on the Ferry',
    'caption': 'A German couple was nice enough to snap our pic on the boat.',
    'phash': 'f8c0c525a383c1f0',
    'dateCreated': '2017-05-08',
    'versions': {
      'thumb': '../public/photos/2017-05-08/thumb/chilling_on_the_ferry.jpg',
      'medium': '../public/photos/2017-05-08/medium/chilling_on_the_ferry.jpg',
      'large': '../public/photos/2017-05-08/large/chilling_on_the_ferry.jpg',
      'huge': '../public/photos/2017-05-08/huge/chilling_on_the_ferry.jpg'
    }
  },
  {
    'title': 'Monastary hike out',
    'caption': 'On our way back from Monastary for some cragging, we witnissed our first Kalymnos sunset.',
    'phash': '5f08e701e701e8e0',
    'dateCreated': '2017-05-08',
    'versions': {
      'thumb': '../public/photos/2017-05-08/thumb/monastary_hike_out.jpg',
      'medium': '../public/photos/2017-05-08/medium/monastary_hike_out.jpg',
      'large': '../public/photos/2017-05-08/large/monastary_hike_out.jpg',
      'huge': '../public/photos/2017-05-08/huge/monastary_hike_out.jpg'
    }
  },
  {
    'title': 'Secret Garden from the Right',
    'caption': 'Another crag overview shot. Just as we were leaving we spotted a pod of dolphins which would probably be in frame in the ocean, but they can\'t be seen here.',
    'phash': '00fef8c0f070f0e0',
    'dateCreated': '2017-05-13',
    'versions': {
      'thumb': '../public/photos/2017-05-13/thumb/secret_garden_from_the_right.jpg',
      'medium': '../public/photos/2017-05-13/medium/secret_garden_from_the_right.jpg',
      'large': '../public/photos/2017-05-13/large/secret_garden_from_the_right.jpg',
      'huge': '../public/photos/2017-05-13/huge/secret_garden_from_the_right.jpg'
    }
  }
]

describe('running queries for json index generation', function() {
  var mock
  var expectation
  beforeEach(function () {
    var promise = new Promise(function(resolve) { return resolve('yay') })
    mock = sinon.mock(jsonWriter)
    expectation = mock.expects('run')
    expectation.returns(promise)
  })
  afterEach(function(){
    mock.restore()
  })

  describe('run', function() {
    it('writes out all files', function() {
      expectation.exactly(3)
      return photoQueries.run(metadata).then(function() {})
    })
  })

  describe('masterIndex', function() {
    it('writes out all image files', function() {
      return photoQueries.masterIndex(metadata).then(function() {
        assert.equal(expectation.args[0][1].length, 3)
      })
    })
  })

  describe('dateIndex', function() {
    it('writes out images for a specific date', function() {
      expectation.twice()
      return photoQueries.dateIndex(metadata).then(function() {
        assert.equal(expectation.args[0][1].length, 2)
        assert.equal(expectation.args[1][1].length, 1)
      })
    })
  })
})
