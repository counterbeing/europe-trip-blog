import assert from 'assert'
import fs from 'fs-extra'
import photoOrganizer from '../lib/photo_organizer'

describe('photoOrganizer', function() {
  beforeEach(function () {
    fs.removeSync('test/tmp')
    fs.copySync(
      'test/fixtures/existing_and_new/',
      'test/tmp'
    )
  })

  it('organizes the photos', function() {
    return photoOrganizer().then(function() {
      let masterIndex = fs.readJsonSync('test/tmp/index.json')
      assert.equal(masterIndex[0].title, 'Chilling on the Ferry')
      assert.equal(masterIndex[1].title, 'Monastary hike out')
      assert.equal(masterIndex.length, 2)
    })
  })
})
