#!/usr/bin/env bash

DOWNLOAD_DIR=$1

wget -O $DOWNLOAD_DIR/current_hots_logs.zip https://d1i1jxrdh2kvwy.cloudfront.net/Data/HOTSLogs%20Data%20Export%20Current.zip
unzip -o $DOWNLOAD_DIR/current_hots_logs.zip -d $DOWNLOAD_DIR