npm uninstall -g ember-cli
npm cache clean
bower cache clean
npm install -g ember-cli@2.14.1
rm -rf node_modules bower_components dist tmp
npm install
bower install
ember init
