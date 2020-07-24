#!/bin/bash
set -ex

out=$(docker pull docker.pkg.github.com/madsadfatcat/genesyx-fansite/genesyx-fansite:latest)

if [[ $out != *"up to date"* ]]; then
  docker stop genesyx-fansite
  docker rm -f genesyx-fansite
  docker-compose up -d
  docker image prune -f
fi
