DROP TABLE cycling_routes;

CREATE TABLE cycling_routes (
    fid SERIAL,
    name VARCHAR(150),
    route GEOMETRY(MultiLineString,4326),
    CONSTRAINT cycling_routes_pkey PRIMARY KEY (fid)
);

CREATE OR REPLACE FUNCTION import_data() RETURNS VOID AS $$
DECLARE 
    route tracks%ROWTYPE;
BEGIN
    FOR route IN
        SELECT * FROM tracks
    LOOP
        INSERT INTO cycling_routes(name, route) VALUES(route.name, route.wkb_geometry);
    END LOOP;        
END
$$
LANGUAGE plpgsql;