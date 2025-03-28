# 📋 Simple Task Manager

> [!NOTE]
> Previous versions of the application can be found in their respective branches and tags.

A basic todo list web application that is part of the CMPS2212 GUI Programming course at the University of Belize and was completed in the 2024-2 semester.

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

A video demonstration of the application can be found on following [YouTube video link]().

## Running The Application

These instruction assume you are using a UNIX-like operating system (Linux, macOS, etc.). If you are using Windows, you may need to adjust the commands accordingly.

### Prerequisites

- `git` command line tool available
- Latest LTS version of [Node.js](https://nodejs.org/en) installed
- [PostgreSQL](https://www.postgresql.org/) server daemon running locally
  - `psql` client command line tool
  - `postgres` user with superuser privileges

### Initial Setup

1. Clone the repository in the whichever directory you prefer on your system.

```
git clone https://github.com/andreshungbz/simple-task-manager.git
```

2. Change the directory to the project folder.

```
cd simple-task-manager
```

3. Rename the `.env.example` file to `.env` to use the default credentials.

> [!WARNING]
> The provided `.env` file is for development purposes only. In a production environmet, please set different credentials.

```
mv .env.example .env
```

4. Install the Node.js project dependencies.

```
npm install
```

### Database Setup

> [!WARNING]
> These steps set up a database with predetermined names and credentials. In a production environment, please set different names and credentials.

1. Run the following command:

```
npm run initiatedb
```

This will essentially run three separate `psql` commands for creating the database and user, creating the necessary tables, and inserting some initial data. Depending on your PostgreSQL host based configuration settings, you may be prompted for passwords during the command. To examine the scripts in more detail, refer to the `package.json` file and the `scripts` folder. The three `psql` commands run sequentially are:

```
psql --username=postgres --file=scripts/setup.sql
```

```
psql --username=stm_user --dbname=cmps2212_stm --file=scripts/tables.sql
```

```
psql --username=stm_user --dbname=cmps2212_stm --file=scripts/data.sql
```

At the end of the script, you will have a `cmps2212_stm` database and a `stm_user` user who is the owner of the database and its tables.

> [!NOTE]
> While using the default `postgres` superuser is generally not recommended for use, it is the easiest way to get the application started. Any PostgreSQL role with the CREATEROLE and CREATEDB attributes will work with the scripts, but you will need to manually adjust the scripts in the `package.json` file yourself.

### Start the Application

1. Run the following command:

```
npm run dev
```

This will start the development server, which keeps track of changes (in prodction you would run `npm start`). Take note of the address logged in the console and visit the application in the web browser at using that address and port. If you prefer, `http://localhost:3000` also works.

## Application Tests

There are some `vitest` tests in the `tests` folder that can be run to conduct certain input validation when operating on a task. It uses a number a `fetch` requests and examines the reponse headers to enure they are what expected. There are some assumptions to note in the comments.

To run the tests, **ensure** the server is running, open a new terminal, and run the following command:

> [!NOTE]
> The tests **WILL** fail if the server is not running.

```
npm run test
```

## Miscellaneous Configuration

There are some settings such as port and tasks per page that can be configured in the `src/config/app.config.ts` file.

## Attributions

Favicon clipboard icon is copyright 2020 Twitter, Inc and other contributors. The graphics are licensed under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/). No modifications were made to the original image.
