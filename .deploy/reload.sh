#!/bin/bash
set -ex

out=$(docker pull docker.pkg.github.com/madsadfatcat/genesyx-fansite/genesyx-fansite:latest)

if [[ $out != *"up to date"* ]]; then
  docker-compose down
  docker-compose up -d
  docker image prune -f
fi
