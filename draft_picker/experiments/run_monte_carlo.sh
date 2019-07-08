#!/usr/bin/env bash


npx babel-node --presets @babel/preset-env experiments/monte_carlo.js | tee two.txt &
npx babel-node --presets @babel/preset-env experiments/monte_carlo.js | tee one.txt &
npx babel-node --presets @babel/preset-env experiments/monte_carlo.js | tee three.txt &
npx babel-node --presets @babel/preset-env experiments/monte_carlo.js | tee four.txt &
npx babel-node --presets @babel/preset-env experiments/monte_carlo.js | tee five.txt &
npx babel-node --presets @babel/preset-env experiments/monte_carlo.js | tee six.txt &
npx babel-node --presets @babel/preset-env experiments/monte_carlo.js | tee seven.txt &
npx babel-node --presets @babel/preset-env experiments/monte_carlo.js | tee eight.txt &
wait

cat one.txt two.txt three.txt four.txt five.txt six.txt seven.txt eight.txt | sed -E 's/^(.*) /\1,/' > all.txt
awk -F  "," '{a[$1] += $2} END{for (i in a) print a[i], i}' < all.txt  | sort -nr