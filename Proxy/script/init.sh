#!/bin/bash

set -e

cd code

npm install > /dev/null 2>&1

echo '{"yarn": "ok"}'
