var assert = require('assert')
var fs = require('fs')
var sinon = require('sinon')
import jsonWriter from '../lib/json_writer'

var object = { fake: 'object' }
var contents =
`{
	"data": {
		"fake": "object"
	}
}`

describe('jsonWriter', function() {
  var spy
  before(function () {
    spy = sinon.spy(fs, 'writeFile')
    return spy
  })
  it('should write a JSON file', function() {
    return jsonWriter('fake_file.json', object).then(function(){
      assert.equal(spy.args[0].length, 2)
      assert.equal(spy.args[0][1], contents)
    })
  })
})
