/* Filename: data.sql */

-- script that populates tasks table with example data
-- meant to be run after setup.sql and assumes the database and user exists

\echo '\n\033[1;34m[PSQL] Inserting example tasks\033[0m'
INSERT INTO tasks (title, description, completed, priority)
VALUES
    ('Record Demo Video for Simple Task Manager', 'Record a 10-15 minute video on the GUI project and upload it to YouTube.', false, 'high'),
    ('Complete OOP Tables', null, false, 'high'),
    ('Design OOP Screens', null, false, 'medium'),
    ('Continue C# Learning', 'Read Chapter 4 of the Head First C# textbook.', false, 'low'),
    ('Write Journal Entry 1', 'Submit journal for the internship days this week.', true, 'high'),
    ('Code Simple Task Management Web Application', 'Complete for GUI class homework/quiz/test.', true, 'medium'),
    ('Customize Work Profile', 'Finish setting up work account profile for internship.', true, 'low');
