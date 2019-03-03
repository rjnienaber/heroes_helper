#!/usr/bin/env bash

DOWNLOAD_DIR=$1
OUTPUT_DIR=$DOWNLOAD_DIR/heroes_test

if [[ "$DOWNLOAD_DIR" = "" ]]; then
    echo A download directory needs to be specified as the first argument to the script
    exit
fi

rm -rf $OUTPUT_DIR
mkdir -p $OUTPUT_DIR

cp $DOWNLOAD_DIR/HeroIDAndMapID.csv $OUTPUT_DIR/HeroIDAndMapID.csv
tail $DOWNLOAD_DIR/Replays.csv > $OUTPUT_DIR/Replays.csv

REPLAY_IDS=`cat $OUTPUT_DIR/Replays.csv | cut -d ',' -f 1 | paste -sd "|" -`

set -x
grep -P "$REPLAY_IDS" $DOWNLOAD_DIR/ReplayCharacters.csv > $OUTPUT_DIR/ReplayCharacters.csv