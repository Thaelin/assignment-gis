#!/bin/bash
for file in *.gpx; do
	ogr2ogr -f "PostgreSQL" PG:"dbname=pdt_geo user=postgres password=postgres" $file
done

