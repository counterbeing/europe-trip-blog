import * as storyProcessor from './story_processor'
import photoOrganizer from './photo_organizer'

import chalk from 'chalk'

console.log(chalk.green('Processing stories...'))
storyProcessor.run()

console.log(chalk.green('Processing photos...'))
photoOrganizer()
