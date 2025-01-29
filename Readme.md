# Discord Voting and Registration Bot

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

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/discord-voting-bot.git
   cd discord-voting-bot
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables in a `.env` file (see [Configuration](#configuration) for details).
4. Run the bot:
   ```bash
   npm start
   ```

---

## Configuration

Create a `.env` file in the root directory and include the following variables:

```env
DISCORD_TOKEN=<your_discord_bot_token>
DATABASE_URL=<your_postgresql_connection_string>
EMAIL_SERVICE=<email_service_provider>
EMAIL_USER=<email_address>
EMAIL_PASSWORD=<email_password>
```

### Environment Variables
- **DISCORD_TOKEN**: Your Discord bot token (obtained from the Discord Developer Portal).
- **DATABASE_URL**: Connection string for your PostgreSQL database.
- **EMAIL_SERVICE**: Email provider service (e.g., Gmail, Outlook).
- **EMAIL_USER**: Email address used for sending verification tokens.
- **EMAIL_PASSWORD**: Password for the email account.

---

## Features

### Registration Process
1. **Step 1**: User sends a registration request via Discord.
2. **Step 2**: The bot checks if the user is already registered.
3. **Step 3**: If not, the bot sends a unique token to the user's email.
4. **Step 4**: The user verifies the token via DM with the bot.

#### Commands:
- **Register**: Initiates the registration process.
  ```
  /register <email>
  ```
- **Verify Token**: Verifies the token sent to the user's email.
  ```
  /verify <token>
  ```

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

#### Commands:
- **Start Voting**: Starts a voting session.
  ```
  /start-vote "Question" "Option1, Option2, Option3"
  ```
- **End Voting**: Ends the current voting session.
  ```
  /end-vote
  ```

---

## Database Schema

The bot uses Sequelize to manage a PostgreSQL database. Below is an example schema:

### Users Table
| Column         | Type         | Description                 |
|----------------|--------------|-----------------------------|
| `id`           | UUID         | Primary key                 |
| `discord_id`   | STRING       | User's Discord ID           |
| `email`        | STRING       | User's email address        |
| `token`        | STRING       | Verification token          |
| `is_verified`  | BOOLEAN      | Whether the user is verified|

### Votes Table
| Column         | Type         | Description                 |
|----------------|--------------|-----------------------------|
| `id`           | UUID         | Primary key                 |
| `question`     | STRING       | Voting question             |
| `options`      | JSON         | Array of voting options     |
| `results`      | JSON         | Tally of votes              |
| `created_at`   | TIMESTAMP    | Time of vote creation       |

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
