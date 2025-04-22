/* Filename: setup.sql */

-- script that creates a PostgreSQL database and user for the project
-- this script is meant to be run with the psql PostgreSQL client
-- the user running the script must have the CREATEROLE and CREATEDB attributes
-- (https://www.postgresql.org/docs/17/sql-createrole.html)

\echo '\n\033[1;31m[PSQL] Dropping Database cmps2212_stm\033[0m'
DROP DATABASE IF EXISTS cmps2212_stm;

\echo '\033[1;34m[PSQL] Creating Database cmps2212_stm\033[0m'
CREATE DATABASE cmps2212_stm;
