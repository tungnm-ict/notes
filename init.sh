#!/bin/bash

set -e

USER=notes
DB=notes
ENVS=${ENV:-development test}
BASEDIR=$(cd $(dirname ${BASH_SOURCE[0]}) && pwd)

SYSTEM_USER_OPTS=
if [ $(uname) == "Linux" ]; then
    SYSTEM_USER_OPTS="-U postgres"
fi

for e in $ENVS; do
    dropdb $SYSTEM_USER_OPTS --if-exists ${DB}_$e
done
dropuser $SYSTEM_USER_OPTS --if-exists $USER


createuser $SYSTEM_USER_OPTS $USER
for e in $ENVS; do
    createdb $SYSTEM_USER_OPTS ${DB}_$e -O $USER
done
