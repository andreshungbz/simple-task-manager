/* Filename: tables.sql */

-- script that creates the necessary database table(s)
-- meant to be run after setup.sql and assumes the database and user exists

\echo '\n\033[1;31m[PSQL] Dropping TABLE tasks\033[0m'
DROP TABLE IF EXISTS tasks;

\echo '\033[1;34m[PSQL] Creating TABLE tasks\033[0m'
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false,
    priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
) OWNER TO stm_user;