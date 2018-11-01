-- Type: weather_data

CREATE TYPE public.weather_data AS
(
	weather_name character varying(50),
	weather_desc character varying(50),
	weather_icon character varying(50),
	weather_api_id integer
);

ALTER TYPE public.weather_data
    OWNER TO postgres;