# Running the Application

This is a basic guide on how to run the AMAK Nextjs application.

## Prerequisites

To run the application, you will need to have the following installed on your machine:

- NodeJS >= 20.16.0: [Download and Install NodeJS](https://nodejs.org/en)
- Git: [Download and Install Git](https://git-scm.com/downloads)

## ENV

```env
PORT=
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH=
MAIL_USER=
MAIL_PASSWORD=
URL_CLIENT=
```

## Features

This project comes with a range of features designed to facilitate project management:

- **Authentication & Authorization**: Users can sign up, log in, and access different parts of the app based on their roles and permissions.

- **Project Management**: Create, update, and manage multiple projects. Assign team members and track project progress efficiently.

- **Task Management**: Each project can contain multiple tasks. You can create, assign, and manage tasks.

- **Project Reporting**: Generate detailed reports for each project. Monitor overall progress, completed tasks, pending tasks, and other key metrics.

## Tech Stack

**Client:** React, MUI, Zustand

**Server:** Node, Express, MongoDb

### Server:

- **Node.js**: A JavaScript runtime built on Chrome's V8 engine, used for server-side scripting.

- **Express**: A minimal and flexible Node.js web application framework, used for building the RESTful API.

- **MongoDB**: A NoSQL database used for storing project and task data.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/vanthang24803/jira-be.git
```

2. Navigate to the project directory:

```bash
cd jira-be
```

3. Install the dependencies:

```bash
yarn install
```

## Run Locally

Once you have installed the dependencies and set the environment variables, you can start the development server by running:

Start dev Application:

```bash
yarn dev
```
Running on Docker

```bash
docker-compose up -d

```
This will start the Express application, and you can view it by navigating to http://localhost:3002.

## License

This project is open-source and available under the MIT License.
