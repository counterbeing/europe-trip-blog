import * as storyProcessor from './story_processor'
import photoOrganizer from './photo_organizer'
// import uploader from './uploader'

import chalk from 'chalk'

console.log(chalk.green('Processing stories...'))
storyProcessor.run()

console.log(chalk.green('Processing photos...'))
photoOrganizer()

// console.log(chalk.green('Uploading photos...'))
// uploader()
