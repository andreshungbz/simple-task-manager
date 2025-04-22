# 📋 Simple Task Manager

> [!NOTE]
> Previous versions of the application can be found in their respective branches and tags.

Simple Task Manager is a basic to-do list web application part of the CMPS2212 GUI Programming course at the University of Belize. It was completed in the 2024-2 semester.

## Application Features

Here are the features of the application:

- Add task
- Update task as complete/incomplete
- Update existing task fields
- Delete task
- Search tasks
- Filter tasks by search term and status
- Sort tasks by priority

## Technology Stack

The application is built using the following technologies:

- TypeScript
- Node.js
- Express.js
- EJS templating engine
- PostgreSQL database

## Video Demonstration

A video demonstration of the application can be found on the following [YouTube video link](https://youtu.be/gLKjjvNg1x8?si=yx7Aebu2EUfmEgiz).

## Running The Application

These instructions assume you are using a UNIX-like operating system (Linux, macOS, etc.). If you are using Windows, you may need to adjust the commands accordingly.

### Prerequisites

- `git` command line tool available
- Latest LTS version of [Node.js](https://nodejs.org/en) installed
- [PostgreSQL](https://www.postgresql.org/) server daemon running locally
  - `psql` client command line tool
  - `postgres` user with superuser privileges

### Initial Setup

1. Clone the repository in whichever directory you prefer on your system.

```
git clone https://github.com/andreshungbz/simple-task-manager.git
```

2. Change the directory to the project folder.

```
cd simple-task-manager
```

3. Copy the `.env.example` file to a new `.env` file to use the default credentials.

> [!WARNING]
> The provided `.env` file is for development purposes only. In a production environment, please set different credentials.

```
cp .env.example .env
```

4. Install the Node.js project dependencies.

```
npm install
```

### Database Setup

> [!WARNING]
> These steps set up a database with predetermined names and credentials. In a production environment, please set different names and credentials.

1. Login to `psql` as the `postgres` superuser and create this user by pasting the following in the `psql` command line:

```
DROP DATABASE IF EXISTS cmps2212_stm;
DROP USER IF EXISTS stm_user;
CREATE USER stm_user WITH CREATEDB PASSWORD 'swordfish';
```

2. Exit `psql`

```
\q
```

3. Run the following command:

```
npm run initiatedb
```

This will essentially run three separate `psql` commands for creating the database, creating the necessary tables, and inserting some initial data. Depending on your PostgreSQL host based configuration settings, you may be prompted for passwords during the command. The default password for `stm_user` is `swordfish`. To examine the scripts in more detail, refer to the `package.json` file and the `scripts` folder.

At the end of the steps, you will have a `cmps2212_stm` database and a `stm_user` user who is the owner of the database and its tables.

> [!NOTE]
> While using the default `postgres` superuser is generally not recommended for use, it is the easiest way to get the application started. Any PostgreSQL role with the CREATEROLE and CREATEDB attributes will work with the scripts, but you will need to manually adjust the scripts in the `package.json` file yourself.

### Start the Application

1. Run the following command:

```
npm run dev
```

This will start the development server, which keeps track of changes (in production, you would run `npm start`). Take note of the address logged in the console and visit the application in the web browser using that address and port. If you prefer, `http://localhost:3000` also works.

## Application Tests

Some `vitest` tests in the `tests` folder can be run to conduct certain input validation when operating on a task. It uses some `fetch` requests and examines the response headers to ensure they are what is expected. There are some assumptions to note in the comments.

To run the tests, **ENSURE** the server is running, open a new terminal, and run the following command:

> [!NOTE]
> The tests **WILL** fail if the server is not running.

```
npm run test
```

## Miscellaneous Configuration

Some settings, such as port and tasks per page, can be configured in the `src/config/app.config.ts` file.

## Attributions

Favicon clipboard icon is copyright 2020 Twitter, Inc., and other contributors. The graphics are licensed under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/). No modifications were made to the original image.
