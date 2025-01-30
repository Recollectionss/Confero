# Discord Voting Bot

This project is a Discord bot designed to handle user registration and manage voting processes within a Discord server. It includes functionalities such as:
- User registration with email and token verification.
- Real-time voting mechanism for server members.
- Integration with a database using Sequelize.

## Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
- [Features](#features)
    - [Registration Process](#registration-process)
    - [Token Verification](#token-verification)
    - [Voting Mechanism](#voting-mechanism)
- [Database Schema](#database-schema)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A PostgreSQL database

Here’s the updated documentation with descriptions for Docker Compose variables and a corrected approach to running the bot:

---

# **Discord Voting Bot Documentation**

This documentation provides detailed steps to set up and run the Discord Voting Bot, including how to configure the application, environment variables, and Docker Compose.

---

## **Steps to Run the Application**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/discord-voting-bot.git
   cd discord-voting-bot
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory and populate it with the necessary variables (refer to the [Configuration](#configuration) section).

3. **Run the application with Docker Compose:**
   Ensure Docker is installed, and then execute:
   ```bash
   docker-compose up --build
   ```

---

## **Configuration**

### **Environment Variables**
Create a `.env` file in the root directory and include the following variables:

```env
# Discord Bot Configuration
DISCORD_TOKEN=<your_discord_bot_token>
POLL_CHANNEL=<poll_channel_id>
COMMAND_CHANNEL=<command_channel_id>

# PostgreSQL Database Configuration
POSTGRES_USERNAME=root
POSTGRES_PASSWORD=root
POSTGRES_PORT=5432
POSTGRES_DB=confero
POSTGRES_HOST=postgres

# Application Database User
POSTGRES_APP_USER_NAME=app
POSTGRES_APP_USER_PASSWORD=ppa

# SMTP Configuration
SMTP_USERNAME=<your_smtp_email>
SMTP_PASSWORD=<your_smtp_password>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### **Environment Variables Description**
- **DISCORD_TOKEN**: Token for the Discord bot (retrieve it from the Discord Developer Portal).
- **POLL_CHANNEL**: ID of the channel where polls will be conducted.
- **COMMAND_CHANNEL**: ID of the channel for bot commands.
- **POSTGRES_USERNAME**: PostgreSQL admin username.
- **POSTGRES_PASSWORD**: PostgreSQL admin password.
- **POSTGRES_PORT**: PostgreSQL port (default is `5432`).
- **POSTGRES_DB**: Name of the PostgreSQL database.
- **POSTGRES_HOST**: Hostname of the PostgreSQL service (use `postgres` for Docker Compose).
- **POSTGRES_APP_USER_NAME**: Application-specific database username.
- **POSTGRES_APP_USER_PASSWORD**: Application-specific database password.
- **SMTP_USERNAME**: Email address for sending emails.
- **SMTP_PASSWORD**: Password for the email account.
- **SMTP_HOST**: SMTP host (e.g., `smtp.gmail.com` for Gmail).
- **SMTP_PORT**: SMTP port (default is `587`).

---

## **Docker Compose Configuration**

### **Docker Compose File**
Below is the `docker-compose.yml` file to orchestrate the bot and PostgreSQL services:

```yaml
version: '3.8'
name: vote_project

services:
  postgres:
    image: postgres:16.3
    restart: always
    container_name: postgress
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - ./db_init:/docker-entrypoint-initdb.d/
      - postgres-data:/var/lib/postgresql/data
    entrypoint: >
      sh -c "chmod +x /docker-entrypoint-initdb.d/db_init.sh && exec docker-entrypoint.sh postgres"
    ports:
      - '${POSTGRES_PORT}:${POSTGRES_PORT}'
    env_file: .env
  bot:
    container_name: bot
    image: node:20
    working_dir: /app
    volumes:
      - ../bot-service:/app
    ports:
      - "5012:5012"
    command: sh -c "npm install && npm run start"
    depends_on:
      - postgres

volumes:
  postgres-data:
```

---

## **Scripts**

The application includes the following scripts for development and database management:

```json
"scripts": {
    "dev": "ts-node-dev src/index.ts",
    "start": "ts-node src/index.ts",
    "lint": "eslint . --ext .ts",
    "migration:generate": "sequelize migration:generate --name",
    "migration:create": "sequelize migration:create --name",
    "migration:up": "sequelize-cli db:migrate",
    "migration:down": "sequelize-cli db:migrate:undo",
    "migration:reset": "sequelize-cli db:migrate:undo:all",
    "seed:create": "sequelize-cli seed:generate --name",
    "seed:up": "npx sequelize-cli db:seed:all",
    "seed:reset": "npx sequelize-cli db:seed:undo:all"
  }
```

---


This markdown version ensures clarity and usability for both developers and administrators.
## Features

### Registration Process
1. **Step 1**: User sends a registration request via Discord.
2. **Step 2**: The bot checks if the user is already registered.
3. **Step 3**: If not, the bot sends a unique token to the user's email.
4. **Step 4**: The user verifies the token via DM with the bot.


### Token Verification
The bot validates tokens as follows:
- Compares the user-provided token with the one stored in the database.
- If the token is valid, the user's registration is marked as complete.
- Sends a confirmation message to the user upon successful verification.

### Voting Mechanism
1. **Step 1**: The bot starts a voting session.
2. **Step 2**: Users can vote by interacting with a Discord message (e.g., reaction or button click).
3. **Step 3**: Votes are tallied in real-time and stored in the database.
4. **Step 4**: At the end of the voting session, results are displayed.

Вибач за непорозуміння! Ось оновлена документація англійською мовою на основі наданого коду:

---

### **Command List**

#### **Add Vote**
Adds a vote for the specified option in the active poll.  
**Syntax:**
```plaintext
!add-vote <Option>
```
**Example:**
```plaintext
!add-vote Option1
```

#### **Get Results**
Displays the results of the latest meeting and its polls.  
**Syntax:**
```plaintext
!get-results
```

#### **Help**
Displays the list of available commands.  
**Syntax:**
```plaintext
!help
```

#### **Open Meeting**
Creates a poll to open the meeting.  
**Syntax:**
```plaintext
!open
```

#### **Create Poll**
Adds a new poll to the agenda.  
**Syntax:**
```plaintext
!poll <Question>
```
**Example:**
```plaintext
!poll "Should we proceed with the project?"
```

---

### **Features and Functionality**

#### **addVote**
Adds a vote for the specified option in the active poll.




## Database Schema

The bot uses Sequelize to manage a PostgreSQL database. Below is an example schema:

### Users Table
| Column   | Type    |
|----------|---------|
| `userId` | STRING  |
| `email`  | STRING  |
| `name`   | STRING  |
### Meeting Table
| Column      | Type    |
|-------------|---------|
| `meetingId` | UUID    |
| `date`      | DATE    |
| `isActive`  | BOOLEAN |
| `minTargetVotes`      | number  |

### RegistrationOnMeeting Table
| Column      | Type    |
|-------------|---------|
| `token` | STRING    |
| `meetingId`      | UUID    |
| `userId`  | string |
| `userVerified`      | BOOLEAN  |

### Poll Table
| Column      | Type         |
|-------------|--------------|
| `pollId`    | UUID         | 
| `question`  | STRING       | 
| `meetingId`   | UUID         | 
| `date`      | DATE    |

### Voted Table
| Column         | Type         |
|----------------|--------------|
| `votedId`           | UUID         | 
| `votedFor`     | STRING       | 
| `pollId`      | UUID         | 
| `results`      | JSON         | 
| `created_at`   | TIMESTAMP    | 

### UserVoice Table
| Column    | Type   |
|-----------|--------|
| `voiceId` | UUID   |
| `voice`   | ENUM ('За', 'Проти', 'Утримався', 'Не голосував/ла')  |
| `voteId`  | UUID |
| `userId`  | STRING |

---

## Error Handling

- **Database Errors**:
    - Wrapped all Sequelize operations in `try-catch` blocks.
    - Logs database errors for debugging.

- **Discord API Errors**:
    - Handles errors gracefully when interacting with Discord APIs.
    - Provides meaningful feedback to users.

- **Email Errors**:
    - Validates email inputs.
    - Logs email-sending errors and retries if necessary.

---

## Best Practices

1. **Security**:
    - Use environment variables for sensitive information.
    - Ensure tokens are random and securely generated.

2. **Scalability**:
    - Use `bulkCreate` for batch operations.
    - Avoid blocking code in event listeners.

3. **Modularity**:
    - Separate logic into modules (e.g., `db`, `services`, `commands`).
    - Use middleware functions where applicable.

---

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request with a detailed description of your changes.
