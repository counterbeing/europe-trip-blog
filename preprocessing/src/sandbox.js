var Promise = require('bluebird')

let imagePresets = [
  { thumb: 100 },
  { medium: 800 },
  { large: 1200},
  { huge: 1600 }
]


function process() {
  return Promise.map(imagePresets, item => {
    return item
  })
}

process().then(result => {
  console.log('result:')
  console.log(result)
})
