-- Table: public.city

-- DROP TABLE public.city;

CREATE TABLE public.city
(
    id integer NOT NULL DEFAULT nextval('city_id_seq'::regclass),
    name character(50) COLLATE pg_catalog."default" NOT NULL,
    country character varying(10) COLLATE pg_catalog."default" NOT NULL,
    coord point NOT NULL,
    CONSTRAINT city_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.city
    OWNER to postgres;