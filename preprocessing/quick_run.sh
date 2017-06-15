#! /usr/bin/env bash

echo 'removing contents of photos dir'
rm -rf ../public/photos/*

echo "moving photos into place for testing"
cp ../public/exported_photos_git_ignore/IMG_0150.jpg ../public/photos/
cp ../public/exported_photos_git_ignore/IMG_0187.jpg ../public/photos/
cp ../public/exported_photos_git_ignore/IMG_6426.jpg ../public/photos/

echo "running script"

npm run all
