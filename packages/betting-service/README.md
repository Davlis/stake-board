<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Betting Service

A NestJS-based betting service that implements the PlaceBet and GetUserBetSummary use cases following clean architecture principles.

## Architecture

The service follows clean architecture with clear separation between:

- **Domain Layer**: Contains entities, repositories interfaces, and business rules
- **Application Layer**: Contains use cases, DTOs, and application services
- **Infrastructure Layer**: Contains HTTP controllers, database implementations, and external service clients

## Module Structure

The service uses a layered module architecture:

### System Module
- **Purpose**: Core infrastructure components
- **Components**: HTTP service, database, configuration, external service clients
- **Location**: `infrastructure/system/system.module.ts`

### Feature Modules
- **Purpose**: Feature-specific functionality
- **Components**: Controllers, use cases, DTOs
- **Location**: `infrastructure/modules/` and `application/`

### Infrastructure Module
- **Purpose**: Orchestrates feature modules
- **Components**: Imports and exports feature modules
- **Location**: `infrastructure/infrastructure.module.ts`

## Use Cases

### PlaceBet Use Case

The PlaceBet use case allows users to place bets on games with the following features:

#### Business Logic

1. **Game Validation**: Fetches game information from the odds service
2. **Time Validation**: Ensures betting is allowed (game hasn't started)
3. **Odds Resolution**: Finds appropriate odds for the selected outcome
4. **Amount Validation**: Validates bet amount is positive
5. **Bet Creation**: Creates and persists the bet with pending status

#### API Endpoint

```
POST /bets
```

**Request Body:**
```json
{
  "userId": "user-123",
  "gameId": "game-456", 
  "selectedOutcome": "home",
  "amount": 100
}
```

**Response:**
```json
{
  "status": 201,
  "data": {
    "id": "1",
    "userId": "user-123",
    "gameId": "game-456",
    "selectedOutcome": "home",
    "amount": 100,
    "odds": 2.5,
    "status": "pending"
  }
}
```

### GetUserBetSummary Use Case

The GetUserBetSummary use case provides comprehensive information about a user's betting activity.

#### Business Logic

1. **User Bet Retrieval**: Fetches all bets for the specified user
2. **Status Aggregation**: Calculates statistics for different bet statuses
3. **Financial Summary**: Computes total winnings and losses
4. **Complete Bet History**: Returns detailed list of all user bets

#### API Endpoint

```
GET /bets/user/:userId/status
```

**Parameters:**
- `userId`: UUID of the user (path parameter)

**Response:**
```json
{
  "status": 200,
  "data": {
    "userId": "user-123",
    "totalBets": 5,
    "pendingBets": 2,
    "wonBets": 2,
    "lostBets": 1,
    "totalWinnings": 250,
    "totalLosses": 100,
    "bets": [
      {
        "id": "1",
        "userId": "user-123",
        "gameId": "game-456",
        "selectedOutcome": "home",
        "amount": 100,
        "odds": 2.5,
        "payout": 250,
        "status": "won"
      }
    ]
  }
}
```

## Validation Rules

### PlaceBet
- `userId`: Required string
- `gameId`: Required string
- `selectedOutcome`: Must be one of: 'home', 'away', 'draw'
- `amount`: Required number, minimum value 1

### GetUserBetSummary
- `userId`: Required UUID format

## Error Handling

- **400 Bad Request**: Invalid input data or business rule violations
- **404 Not Found**: Game not found in odds service or no bets found for user
- **500 Internal Server Error**: Service communication issues

## Database Configuration

The service uses TypeORM with PostgreSQL for data persistence. The database configuration follows the same pattern as the odds-service.

### Database Entity

The `Bet` entity includes:
- UUID primary key
- User and game references
- Bet details (outcome, amount, odds)
- Status tracking (pending, won, lost)
- Timestamps for creation and updates

### Repository Pattern

- **Generic Repository**: Base class for common CRUD operations
- **Bet Repository**: Specific implementation for bet operations
- **TypeORM Integration**: Proper mapping between domain entities and database entities

## Project Structure

```
packages/betting-service/
├── domain/
│   ├── entities/
│   │   └── Bet.ts                    # Bet domain entity
│   ├── repositories/
│   │   ├── IBetRepository.ts         # Repository interface
│   │   └── IGenericRepository.ts     # Generic repository interface
│   └── types.ts                      # Common types
├── application/
│   └── bets/
│       ├── dto/
│       │   ├── PlaceBetDto.ts        # Input validation DTO
│       │   └── GetUserBetSummaryDto.ts   # User status DTO
│       ├── providers/
│       │   └── IOddsServiceClient.ts # External service interface
│       ├── useCases/
│       │   ├── PlaceBet.ts           # Place bet use case
│       │   └── GetUserBetSummary.ts      # Get user status use case
│       └── bets.module.ts            # Application module
├── infrastructure/
│   ├── system/
│   │   └── system.module.ts          # Core infrastructure module
│   ├── clients/
│   │   └── OddsServiceClient.ts      # HTTP client for odds service
│   ├── database/
│   │   ├── entities/
│   │   │   └── bet.entity.ts         # TypeORM entity
│   │   ├── repositories/
│   │   │   ├── generic.repository.ts # Generic repository base
│   │   │   └── bet.repository.ts     # Bet repository implementation
│   │   └── database.module.ts        # Database module
│   ├── modules/
│   │   └── bets/
│   │       ├── bets.controller.ts    # HTTP controller
│   │       └── bets.module.ts        # Infrastructure module
│   └── infrastructure.module.ts      # Infrastructure module
└── src/
    ├── app.module.ts                 # Main application module
    └── main.ts                       # Application entry point
```

## Dependencies

- `@nestjs/axios`: HTTP client for external service communication
- `@nestjs/config`: Configuration management
- `@nestjs/typeorm`: TypeORM integration
- `typeorm`: ORM for database operations
- `pg`: PostgreSQL driver
- `class-validator`: Input validation
- `class-transformer`: Data transformation

## Running the Service

```bash
# Install dependencies
yarn install

# Start in development mode
yarn start:dev

# Run tests
yarn test

# Run e2e tests
yarn test:e2e
```

## Environment Variables

### Service Configuration
- `ODDS_SERVICE_URL`: URL of the odds service (default: http://localhost:3001)
- `PORT`: Service port (default: 3000)

### Database Configuration
- `DB_HOST`: PostgreSQL host (default: localhost)
- `DB_PORT`: PostgreSQL port (default: 5432)
- `DB_USER`: PostgreSQL username
- `DB_PASS`: PostgreSQL password
- `DB_NAME`: PostgreSQL database name

Example `.env` file:
```env
ODDS_SERVICE_URL=http://localhost:3001
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=betting_service
```

## Testing

The service includes comprehensive tests:

- **Unit Tests**: Test individual use cases and components
- **E2E Tests**: Test complete HTTP endpoints
- **Integration Tests**: Test service interactions

Run tests with:
```bash
yarn test
yarn test:e2e
```

## Future Enhancements

- User balance validation
- Bet settlement logic
- Real-time odds updates
- Audit logging
- Rate limiting
