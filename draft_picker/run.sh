#!/usr/bin/env bash
node picker.js

while inotifywait -qq -e close_write picker.js solver.js team_fitness.js; do node picker.js; done