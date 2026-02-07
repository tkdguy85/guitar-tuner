#!/usr/bin/env sh

# abort on errors
set -e

npm run build

cd dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:tkdguy85/guitar-tuner.git main:gh-pages

cd -