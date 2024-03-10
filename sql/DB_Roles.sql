-- Create roles
    CREATE ROLE senior_dev LOGIN PASSWORD 'secure_password1';
    CREATE ROLE medium_dev LOGIN PASSWORD 'secure_password2';
    CREATE ROLE junior_dev LOGIN PASSWORD 'secure_password3';
    CREATE ROLE basic_user LOGIN PASSWORD 'secure_password4';

    -- Create views for each role
    -- Senior Developer gets access to everything, no views needed for full access

    -- Medium Developer Views
    CREATE OR REPLACE VIEW medium_dev_media AS SELECT * FROM Media;
    CREATE OR REPLACE VIEW medium_dev_series AS SELECT * FROM Series;
    CREATE OR REPLACE VIEW medium_dev_seasons AS SELECT * FROM Seasons;
	CREATE OR REPLACE VIEW medium_dev_watchList AS SELECT * FROM WatchList;
	CREATE OR REPLACE VIEW medium_dev_subtitles AS SELECT * FROM Subtitles;
    -- Add more views as needed for medium_dev

    -- Junior Developer Views
    CREATE OR REPLACE VIEW junior_dev_media AS SELECT * FROM Media;
    CREATE OR REPLACE VIEW junior_dev_series AS SELECT * FROM Series;
	CREATE OR REPLACE VIEW junior_dev_seasons AS SELECT * FROM Seasons;
	CREATE OR REPLACE VIEW junior_dev_subtitles AS SELECT * FROM Subtitles;
    -- Add more views as needed for junior_dev
	
    -- Grant access to views
    -- Senior Developer
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO senior_dev;

    -- Medium Developer
    GRANT USAGE ON SCHEMA public TO medium_dev;
    GRANT SELECT ON public.medium_dev_media, public.medium_dev_series, public.medium_dev_seasons, public.medium_dev_watchList, public.medium_dev_subtitles TO medium_dev;

    -- Junior Developer
    GRANT USAGE ON SCHEMA public TO junior_dev;
    GRANT SELECT ON public.junior_dev_media, public.junior_dev_series, public.junior_dev_seasons, public.junior_dev_subtitles TO junior_dev;
    -- The above GRANT commands should be replicated for each view created for each role.