#!/bin/bash

set -e

BASEDIR=$(cd $(dirname ${BASH_SOURCE[0]}) && pwd)
(cd $BASEDIR && rm -rf node_modules && npm install)
