# turfjs-experiments
Experiments with turf js

## Data

https://conte-ecology.github.io/shedsGisData/

## Client-Side Turf JS

Simplify geojson with mapshaper
```command
mapshaper catchments01-ct-eightmile.geojson -simplify dp 15% -o precision=.00001 format=geojson ../data/catchments-eightmile.geojson
mapshaper truncated-flowlines01-ct-eightmile.geojson -simplify dp 15% -o precision=.00001 format=geojson ../data/flowlines-eightmile.geojson
```
