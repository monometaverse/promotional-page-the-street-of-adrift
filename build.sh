#!/bin/bash
yarn build:prod --mode uat
# 判断 dist 文件夹是否成功生成
if [ -e dist ]
then
    echo 'Build success'
else
    echo 'Build failed'
    exit 1
fi
