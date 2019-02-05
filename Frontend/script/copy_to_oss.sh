#!/bin/bash

set -e

cd code/build

aliyun oss cp . oss://ims-frontend001 -r > /dev/null 2>&1

echo '{"oss": "ok"}'
