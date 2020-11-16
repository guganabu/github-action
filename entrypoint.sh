#!/bin/sh -l

echo "Hello $3"
time=$(date)
path="$1"
echo "Path $path"
echo "::set-output name=time::$time"
echo "::set-output name=path::$path"
