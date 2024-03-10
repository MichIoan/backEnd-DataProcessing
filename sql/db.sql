--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

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

--
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


--
-- Name: add_season_with_episodes(integer, integer, date, json); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.add_season_with_episodes(IN target_series_id integer, IN new_season_number integer, IN new_season_release_date date, IN episodes_data json)
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_season_id INT;
    episode RECORD;
BEGIN
    -- Insert the new season and get the season ID
    INSERT INTO "Seasons" (series_id, season_number, release_date)
    VALUES (target_series_id, new_season_number, new_season_release_date)
    RETURNING season_id INTO new_season_id;

    -- Loop over episodes data
    FOR episode IN SELECT * FROM json_populate_recordset(NULL::record, episodes_data)
    LOOP
        -- Insert the episode
        INSERT INTO "Media" (season_id, episode_number, title, duration, release_date)
        VALUES (new_season_id, episode.episode_number, episode.title, episode.duration, episode.release_date);
    END LOOP;
END;
$$;


ALTER PROCEDURE public.add_season_with_episodes(IN target_series_id integer, IN new_season_number integer, IN new_season_release_date date, IN episodes_data json) OWNER TO postgres;

--
-- Name: check_profile_limit(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_profile_limit() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF (SELECT COUNT(*) FROM public."Profiles" WHERE user_id = NEW.user_id) >= 4 THEN
        RAISE EXCEPTION 'User has reached the profile limit.';
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.check_profile_limit() OWNER TO postgres;

--
-- Name: create_preference_for_profile(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_preference_for_profile() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Insert a default preferences row for the newly created profile
    INSERT INTO public."Preferences" (profile_id, content_type, genre, minimum_age, viewing_classification)
    VALUES (NEW.profile_id, 'Default', 'Default', 'Default', 'Default');

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.create_preference_for_profile() OWNER TO postgres;

--
-- Name: create_season(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_season() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO public."Seasons" (series_id)
    VALUES (NEW.series_id);
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.create_season() OWNER TO postgres;

--
-- Name: create_series_with_seasons_and_episodes(text, text, date, text, text, json, json); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.create_series_with_seasons_and_episodes(IN series_title text, IN series_age_restriction text, IN series_start_date date, IN series_genre text, IN series_viewing_classification text, IN seasons_data json, IN episodes_data json)
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_series_id INT;
    new_season_id INT;
    season RECORD;
    episode RECORD;
BEGIN
    -- Insert the new series and get the series ID
    INSERT INTO "Series" (title, age_restriction, start_date, genre, viewing_classification)
    VALUES (series_title, series_age_restriction, series_start_date, series_genre, series_viewing_classification)
    RETURNING series_id INTO new_series_id;

    -- Loop over seasons data
    FOR season IN SELECT * FROM json_populate_recordset(NULL::record, seasons_data)
    LOOP
        -- Insert the season and get the season ID
        INSERT INTO "Seasons" (series_id, season_number, release_date)
        VALUES (new_series_id, season.season_number, season.release_date)
        RETURNING season_id INTO new_season_id;

        -- Loop over episodes data
        FOR episode IN SELECT * FROM json_populate_recordset(NULL::record, episodes_data)
        LOOP
            -- Insert the episode if the season_number matches
            IF episode.season_number = season.season_number THEN
                INSERT INTO "Media" (season_id, episode_number, title, duration, release_date)
                VALUES (new_season_id, episode.episode_number, episode.title, episode.duration, episode.release_date);
            END IF;
        END LOOP;
    END LOOP;
END;
$$;


ALTER PROCEDURE public.create_series_with_seasons_and_episodes(IN series_title text, IN series_age_restriction text, IN series_start_date date, IN series_genre text, IN series_viewing_classification text, IN seasons_data json, IN episodes_data json) OWNER TO postgres;

--
-- Name: create_subscription(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_subscription() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO public."Subscriptions" (user_id, type, status, description, start_date, end_date)
    VALUES (
        NEW.user_id,
        'trial',
        'active',
        'You have a trial active, please consider getting a paid subscription.',
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '7 days'
    );
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.create_subscription() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Media" (
    media_id integer NOT NULL,
    season_id integer,
    episode_number integer,
    title character varying(255),
    duration double precision,
    release_date date
);


ALTER TABLE public."Media" OWNER TO postgres;

--
-- Name: Media_media_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Media_media_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Media_media_id_seq" OWNER TO postgres;

--
-- Name: Media_media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Media_media_id_seq" OWNED BY public."Media".media_id;


--
-- Name: Preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Preferences" (
    preference_id integer NOT NULL,
    profile_id integer NOT NULL,
    content_type character varying(255),
    genre character varying(255),
    minimum_age character varying(50),
    viewing_classification character varying(50)
);


ALTER TABLE public."Preferences" OWNER TO postgres;

--
-- Name: Preferences_preference_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Preferences_preference_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Preferences_preference_id_seq" OWNER TO postgres;

--
-- Name: Preferences_preference_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Preferences_preference_id_seq" OWNED BY public."Preferences".preference_id;


--
-- Name: Profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Profiles" (
    profile_id integer NOT NULL,
    user_id integer,
    name character varying(255),
    photo_path character varying(255),
    child_profile boolean,
    date_of_birth date,
    language character varying(255)
);


ALTER TABLE public."Profiles" OWNER TO postgres;

--
-- Name: Profile_profile_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Profile_profile_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Profile_profile_id_seq" OWNER TO postgres;

--
-- Name: Profile_profile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Profile_profile_id_seq" OWNED BY public."Profiles".profile_id;


--
-- Name: Seasons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Seasons" (
    season_id integer NOT NULL,
    series_id integer,
    season_number integer,
    release_date date
);


ALTER TABLE public."Seasons" OWNER TO postgres;

--
-- Name: Season_season_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Season_season_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Season_season_id_seq" OWNER TO postgres;

--
-- Name: Season_season_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Season_season_id_seq" OWNED BY public."Seasons".season_id;


--
-- Name: Series; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Series" (
    series_id integer NOT NULL,
    title character varying(255),
    age_restriction character varying(255),
    start_date date,
    genre character varying(255)[],
    viewing_classification character varying(255)[]
);


ALTER TABLE public."Series" OWNER TO postgres;

--
-- Name: Series_series_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Series_series_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Series_series_id_seq" OWNER TO postgres;

--
-- Name: Series_series_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Series_series_id_seq" OWNED BY public."Series".series_id;


--
-- Name: Subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Subscriptions" (
    subscription_id integer NOT NULL,
    user_id integer,
    price double precision,
    type character varying(255),
    status character varying(255),
    start_date date,
    end_date date,
    description text
);


ALTER TABLE public."Subscriptions" OWNER TO postgres;

--
-- Name: Subscription_subscription_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Subscription_subscription_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Subscription_subscription_id_seq" OWNER TO postgres;

--
-- Name: Subscription_subscription_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Subscription_subscription_id_seq" OWNED BY public."Subscriptions".subscription_id;


--
-- Name: Subtitles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Subtitles" (
    subtitle_id integer NOT NULL,
    media_id integer,
    language character varying(255),
    subtitle_path character varying(255)
);


ALTER TABLE public."Subtitles" OWNER TO postgres;

--
-- Name: Subtitles_subtitle_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Subtitles_subtitle_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Subtitles_subtitle_id_seq" OWNER TO postgres;

--
-- Name: Subtitles_subtitle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Subtitles_subtitle_id_seq" OWNED BY public."Subtitles".subtitle_id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    user_id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    failed_login_attempts integer,
    referral_code character varying(255),
    has_discount boolean,
    locked_until timestamp with time zone,
    trial_available boolean,
    status character varying(255)
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: User_account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_account_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_account_id_seq" OWNER TO postgres;

--
-- Name: User_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_account_id_seq" OWNED BY public."Users".user_id;


--
-- Name: WatchHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WatchHistory" (
    history_id integer NOT NULL,
    profile_id integer,
    media_id integer,
    resume_to character varying(255),
    times_watched integer,
    time_stamp timestamp with time zone,
    viewing_status character varying(255)
);


ALTER TABLE public."WatchHistory" OWNER TO postgres;

--
-- Name: WatchHistory_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."WatchHistory_history_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."WatchHistory_history_id_seq" OWNER TO postgres;

--
-- Name: WatchHistory_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."WatchHistory_history_id_seq" OWNED BY public."WatchHistory".history_id;


--
-- Name: WatchList; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WatchList" (
    list_id integer NOT NULL,
    profile_id integer,
    media_id integer,
    viewing_status character varying(255) NOT NULL
);


ALTER TABLE public."WatchList" OWNER TO postgres;

--
-- Name: WatchList_list_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."WatchList_list_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."WatchList_list_id_seq" OWNER TO postgres;

--
-- Name: WatchList_list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."WatchList_list_id_seq" OWNED BY public."WatchList".list_id;


--
-- Name: userpreferencesview; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.userpreferencesview AS
 SELECT u.user_id,
    u.email,
    pr.profile_id,
    pr.name AS profile_name,
    p.preference_id,
    p.content_type,
    p.genre,
    p.minimum_age,
    p.viewing_classification
   FROM ((public."Users" u
     JOIN public."Profiles" pr ON ((u.user_id = pr.user_id)))
     JOIN public."Preferences" p ON ((pr.profile_id = p.profile_id)));


ALTER VIEW public.userpreferencesview OWNER TO postgres;

--
-- Name: view_movies; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.view_movies AS
 SELECT media_id,
    season_id,
    episode_number,
    title,
    duration,
    release_date
   FROM public."Media"
  WHERE (season_id IS NULL);


ALTER VIEW public.view_movies OWNER TO postgres;

--
-- Name: Media media_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Media" ALTER COLUMN media_id SET DEFAULT nextval('public."Media_media_id_seq"'::regclass);


--
-- Name: Preferences preference_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Preferences" ALTER COLUMN preference_id SET DEFAULT nextval('public."Preferences_preference_id_seq"'::regclass);


--
-- Name: Profiles profile_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Profiles" ALTER COLUMN profile_id SET DEFAULT nextval('public."Profile_profile_id_seq"'::regclass);


--
-- Name: Seasons season_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Seasons" ALTER COLUMN season_id SET DEFAULT nextval('public."Season_season_id_seq"'::regclass);


--
-- Name: Series series_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Series" ALTER COLUMN series_id SET DEFAULT nextval('public."Series_series_id_seq"'::regclass);


--
-- Name: Subscriptions subscription_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscriptions" ALTER COLUMN subscription_id SET DEFAULT nextval('public."Subscription_subscription_id_seq"'::regclass);


--
-- Name: Subtitles subtitle_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subtitles" ALTER COLUMN subtitle_id SET DEFAULT nextval('public."Subtitles_subtitle_id_seq"'::regclass);


--
-- Name: Users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN user_id SET DEFAULT nextval('public."User_account_id_seq"'::regclass);


--
-- Name: WatchHistory history_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WatchHistory" ALTER COLUMN history_id SET DEFAULT nextval('public."WatchHistory_history_id_seq"'::regclass);


--
-- Name: WatchList list_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WatchList" ALTER COLUMN list_id SET DEFAULT nextval('public."WatchList_list_id_seq"'::regclass);


--
-- Data for Name: Media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Media" (media_id, season_id, episode_number, title, duration, release_date) FROM stdin;
\.


--
-- Data for Name: Preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Preferences" (preference_id, profile_id, content_type, genre, minimum_age, viewing_classification) FROM stdin;
\.


--
-- Data for Name: Profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Profiles" (profile_id, user_id, name, photo_path, child_profile, date_of_birth, language) FROM stdin;
\.


--
-- Data for Name: Seasons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Seasons" (season_id, series_id, season_number, release_date) FROM stdin;
\.


--
-- Data for Name: Series; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Series" (series_id, title, age_restriction, start_date, genre, viewing_classification) FROM stdin;
\.


--
-- Data for Name: Subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Subscriptions" (subscription_id, user_id, price, type, status, start_date, end_date, description) FROM stdin;
\.


--
-- Data for Name: Subtitles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Subtitles" (subtitle_id, media_id, language, subtitle_path) FROM stdin;
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (user_id, email, password, failed_login_attempts, referral_code, has_discount, locked_until, trial_available, status) FROM stdin;
\.


--
-- Data for Name: WatchHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WatchHistory" (history_id, profile_id, media_id, resume_to, times_watched, time_stamp, viewing_status) FROM stdin;
\.


--
-- Data for Name: WatchList; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WatchList" (list_id, profile_id, media_id, viewing_status) FROM stdin;
\.


--
-- Name: Media_media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Media_media_id_seq"', 1, false);


--
-- Name: Preferences_preference_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Preferences_preference_id_seq"', 1, false);


--
-- Name: Profile_profile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Profile_profile_id_seq"', 1, false);


--
-- Name: Season_season_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Season_season_id_seq"', 1, false);


--
-- Name: Series_series_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Series_series_id_seq"', 1, false);


--
-- Name: Subscription_subscription_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Subscription_subscription_id_seq"', 1, false);


--
-- Name: Subtitles_subtitle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Subtitles_subtitle_id_seq"', 1, false);


--
-- Name: User_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_account_id_seq"', 1, false);


--
-- Name: WatchHistory_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."WatchHistory_history_id_seq"', 1, false);


--
-- Name: WatchList_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."WatchList_list_id_seq"', 1, false);


--
-- Name: Media Media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Media"
    ADD CONSTRAINT "Media_pkey" PRIMARY KEY (media_id);


--
-- Name: Preferences Preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Preferences"
    ADD CONSTRAINT "Preferences_pkey" PRIMARY KEY (preference_id);


--
-- Name: Profiles Profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Profiles"
    ADD CONSTRAINT "Profile_pkey" PRIMARY KEY (profile_id);


--
-- Name: Seasons Season_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Seasons"
    ADD CONSTRAINT "Season_pkey" PRIMARY KEY (season_id);


--
-- Name: Series Series_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Series"
    ADD CONSTRAINT "Series_pkey" PRIMARY KEY (series_id);


--
-- Name: Subscriptions Subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscriptions"
    ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY (subscription_id);


--
-- Name: Subtitles Subtitles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subtitles"
    ADD CONSTRAINT "Subtitles_pkey" PRIMARY KEY (subtitle_id);


--
-- Name: Users User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (user_id);


--
-- Name: WatchHistory WatchHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WatchHistory"
    ADD CONSTRAINT "WatchHistory_pkey" PRIMARY KEY (history_id);


--
-- Name: WatchList WatchList_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WatchList"
    ADD CONSTRAINT "WatchList_pkey" PRIMARY KEY (list_id);


--
-- Name: Users after_user_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER after_user_insert AFTER INSERT ON public."Users" FOR EACH ROW EXECUTE FUNCTION public.create_subscription();


--
-- Name: Profiles profile_limit_before_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER profile_limit_before_insert BEFORE INSERT ON public."Profiles" FOR EACH ROW EXECUTE FUNCTION public.check_profile_limit();


--
-- Name: Profiles trigger_create_preference; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_create_preference AFTER INSERT ON public."Profiles" FOR EACH ROW EXECUTE FUNCTION public.create_preference_for_profile();


--
-- Name: Media Media_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Media"
    ADD CONSTRAINT "Media_season_id_fkey" FOREIGN KEY (season_id) REFERENCES public."Seasons"(season_id);


--
-- Name: Preferences Preferences_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Preferences"
    ADD CONSTRAINT "Preferences_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES public."Profiles"(profile_id) ON DELETE CASCADE;


--
-- Name: Profiles Profile_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Profiles"
    ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(user_id) ON DELETE CASCADE;


--
-- Name: Seasons Season_series_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Seasons"
    ADD CONSTRAINT "Season_series_id_fkey" FOREIGN KEY (series_id) REFERENCES public."Series"(series_id);


--
-- Name: Subscriptions Subscription_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscriptions"
    ADD CONSTRAINT "Subscription_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Subtitles Subtitles_media_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subtitles"
    ADD CONSTRAINT "Subtitles_media_id_fkey" FOREIGN KEY (media_id) REFERENCES public."Media"(media_id);


--
-- Name: WatchHistory WatchHistory_media_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WatchHistory"
    ADD CONSTRAINT "WatchHistory_media_id_fkey" FOREIGN KEY (media_id) REFERENCES public."Media"(media_id);


--
-- Name: WatchHistory WatchHistory_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WatchHistory"
    ADD CONSTRAINT "WatchHistory_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES public."Profiles"(profile_id);


--
-- Name: WatchList WatchList_media_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WatchList"
    ADD CONSTRAINT "WatchList_media_id_fkey" FOREIGN KEY (media_id) REFERENCES public."Media"(media_id);


--
-- Name: WatchList WatchList_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WatchList"
    ADD CONSTRAINT "WatchList_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES public."Profiles"(profile_id);


--
-- PostgreSQL database dump complete
--

