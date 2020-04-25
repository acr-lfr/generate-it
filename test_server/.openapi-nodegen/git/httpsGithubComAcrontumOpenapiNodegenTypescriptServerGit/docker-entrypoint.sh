#!/bin/sh

echo "Command: $@"

command="${1:-prod}"

case $command in
  watch)
    npm install
    npm run dev:build-watch
  ;;
  dev)
    echo "Running dev server..."
    npm run dev:start-watch
  ;;
  prod)
    echo "Running server..."
    npm run start
  ;;
esac
