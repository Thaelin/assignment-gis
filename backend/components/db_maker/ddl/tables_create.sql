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