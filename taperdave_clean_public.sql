--
-- PostgreSQL database dump
--

\restrict 8VDQQgV9dan059iWyHE5mLC4QXQFAmNYy62erNJ6uWFPdO4CzXwC1jpbD7mMpDc

-- Dumped from database version 15.8
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP POLICY IF EXISTS "Allow authenticated write access" ON public.query_cache;
DROP INDEX IF EXISTS public.id;
ALTER TABLE IF EXISTS ONLY public.shows DROP CONSTRAINT IF EXISTS shows_pkey;
ALTER TABLE IF EXISTS ONLY public.query_cache DROP CONSTRAINT IF EXISTS query_cache_pkey;
DROP TABLE IF EXISTS public.sources;
DROP TABLE IF EXISTS public.shows;
DROP TABLE IF EXISTS public.query_cache;
DROP SCHEMA IF EXISTS public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: query_cache; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.query_cache (
    query text NOT NULL,
    result text
);


--
-- Name: shows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shows (
    show_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    artist text NOT NULL,
    artist_sort text NOT NULL,
    showdate text NOT NULL,
    venue text,
    city text,
    city_state text,
    sources smallint,
    pcloudlink text,
    archivelink text,
    samplefile text,
    venue_logo text,
    venue_logo_h integer,
    venue_logo_w integer,
    artist_wide text,
    artist_wide_h integer,
    artist_wide_w integer,
    artist_square text,
    artist_square_h integer,
    artist_square_w integer,
    setlist text
);


--
-- Name: sources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sources (
    id smallint NOT NULL,
    sourcetext text
);


--
-- Data for Name: query_cache; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.query_cache (query, result) FROM stdin;
getshowlistsource	[]
getshowlistalpha	[]
getshowlistcity	[]
getshowlistchrono	[]
getshowlistvenue	[]
\.


--
-- Data for Name: shows; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shows (show_id, artist, artist_sort, showdate, venue, city, city_state, sources, pcloudlink, archivelink, samplefile, venue_logo, venue_logo_h, venue_logo_w, artist_wide, artist_wide_h, artist_wide_w, artist_square, artist_square_h, artist_square_w, setlist) FROM stdin;
\.


--
-- Data for Name: sources; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sources (id, sourcetext) FROM stdin;
5	AudioTechnica 853s
9	SBD + AT853
10	SBD + ZoomH5
11	SBD + ZoomH6
12	SBD + ZoomH4n
20	Soundboard
25	MBHO
29	other
34	ZoomH5
35	ZoomH6
36	ZoomH4n
4	Golden Age Project FC4s
8	SBD + Golden Age Project FC4s
\.


--
-- Name: query_cache query_cache_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.query_cache
    ADD CONSTRAINT query_cache_pkey PRIMARY KEY (query);


--
-- Name: shows shows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shows
    ADD CONSTRAINT shows_pkey PRIMARY KEY (show_id);


--
-- Name: id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX id ON public.sources USING btree (id) WITH (deduplicate_items='true');


--
-- Name: query_cache Allow authenticated write access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow authenticated write access" ON public.query_cache TO authenticated USING (true);


--
-- Name: query_cache; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.query_cache ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict 8VDQQgV9dan059iWyHE5mLC4QXQFAmNYy62erNJ6uWFPdO4CzXwC1jpbD7mMpDc

