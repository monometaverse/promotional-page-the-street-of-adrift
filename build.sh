#!/bin/bash
yarn build:prod
# 判断 dist 文件夹是否成功生成
test -f dist
if [ $? == 0 ]
then
    echo 'Build success'
else
    echo 'Build failed'
    exit 1
fi
