# Common Package

This package contains shared interfaces and contracts between microservices in the betting application.

## Structure

The package follows a clear architecture approach with Input and Output boundaries for each service endpoint:

```
src/
├── contracts/
│   ├── odds/           # Odds Service contracts
│   ├── betting/        # Betting Service contracts
│   └── sheets/         # Sheets Service contracts
└── index.ts            # Main exports
```

## Naming Convention

- **InputBoundary**: Defines the input contract for an endpoint
- **OutputBoundary**: Defines the output contract for an endpoint

## Services and Endpoints

### Odds Service
- `ListOddsInputBoundary` / `ListOddsOutputBoundary` - GET /odds
- `RefreshOddsInputBoundary` / `RefreshOddsOutputBoundary` - POST /odds/refresh
- `ListGamesInputBoundary` / `ListGamesOutputBoundary` - GET /odds/games
- `GetGameWithOddsInputBoundary` / `GetGameWithOddsOutputBoundary` - GET /odds/games/:id
- `RandomizeGameResultInputBoundary` / `RandomizeGameResultOutputBoundary` - POST /odds/games/random

### Betting Service
- `PlaceBetInputBoundary` / `PlaceBetOutputBoundary` - POST /bets
- `GetUserBetSummaryInputBoundary` / `GetUserBetSummaryOutputBoundary` - GET /bets/user/:userId/status

### Sheets Service
- `GetGamesAndOddsForTabInputBoundary` / `GetGamesAndOddsForTabOutputBoundary` - GET /sheets/games
- `SheetsPlaceBetInputBoundary` / `SheetsPlaceBetOutputBoundary` - POST /sheets/users/:userId/bets
- `SheetsGetUserBetSummaryInputBoundary` / `SheetsGetUserBetSummaryOutputBoundary` - GET /sheets/users/:userId/bets

## Usage

Import the contracts in your service:

```typescript
import { 
  ListOddsInputBoundary, 
  ListOddsOutputBoundary,
  SheetsPlaceBetInputBoundary,
  SheetsPlaceBetOutputBoundary
} from 'common';
```

## Building

```bash
npm run build
```

This will generate the TypeScript declarations in the `dist/` directory. 