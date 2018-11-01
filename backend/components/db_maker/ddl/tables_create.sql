-- Table: public.city

CREATE TABLE public.city
(
    id serial NOT NULL,
    name character varying(100) NOT NULL,
    country character varying(10) NOT NULL,
    coord point NOT NULL,
    api_city_id integer NOT NULL,
    CONSTRAINT city_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;

ALTER TABLE public.city
    OWNER to postgres;


-- Table: public.experiment_target

CREATE TABLE public.experiment_target
(
    id serial NOT NULL,
    city_id integer NOT NULL,
    started date,
    CONSTRAINT experiment_target_pkey PRIMARY KEY (id),
    CONSTRAINT city_id_fkey FOREIGN KEY (city_id)
        REFERENCES public.city (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
TABLESPACE pg_default;

ALTER TABLE public.experiment_target
    OWNER to postgres;
COMMENT ON TABLE public.experiment_target
    IS 'table of cities that are being targeted by our experiment';

-- Table: public.experiment_target_weather_data

CREATE TABLE public.experiment_target_weather_data
(
    id serial NOT NULL,
    weather weather_data,
    temperature numeric,
    pressure numeric,
    humidity numeric,
    visibility numeric,
    wind_speed numeric,
    wind_degree numeric,
    cloudiness numeric,
    experiment_target_id integer,
    CONSTRAINT experiment_target_weather_data_pkey PRIMARY KEY (id),
    CONSTRAINT experiment_target_id_fkey FOREIGN KEY (experiment_target_id)
        REFERENCES public.experiment_target (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
TABLESPACE pg_default;

ALTER TABLE public.experiment_target_weather_data
    OWNER to postgres;
COMMENT ON TABLE public.experiment_target_weather_data
    IS 'Table for storing weather data of city that is part of experiment.';