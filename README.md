# Bet App - Microservices Architecture

This project consists of three microservices built with NestJS:

- **betting-service**: Handles bet placement and management
- **odds-service**: Manages game odds and results
- **sheets-service**: Exposes API endpoints used by the Google Sheets based dashboard

## Architecture

The project follows a clean architecture pattern with clear separation between:
- **Application Layer**: Use cases and business logic
- **Domain Layer**: Entities and repositories
- **Infrastructure Layer**: Controllers, DTOs, and external integrations

## Local Development

### Prerequisites

- Node.js 18+
- Yarn
- PostgreSQL

### Setup

```bash
# Install dependencies
yarn install

# Build common package
cd packages/common && yarn build && cd ../..

# Start services in development mode
cd packages/betting-service && yarn start:dev
cd packages/odds-service && yarn start:dev
cd packages/sheets-service && yarn start:dev
```

## API Endpoints

### Postman Collection

A comprehensive Postman collection is available for testing all API endpoints. The collection includes:

- Pre-configured requests for all service endpoints
- Example request bodies and parameters
- Response examples and validation

**To import the collection:**

1. Download the Postman collection file from the project repository (`postman-collection.json`)
2. Open Postman and click "Import"
3. Select the downloaded collection file

**Collection includes:**
- Betting service endpoints with sample bet data
- Odds service endpoints for game and odds management
- Sheets service endpoints for Google Sheets integration


### Using ngrok for API exposure

To expose the sheets-service for use by the client-facing (frontend) service acting as a BFF (Backend for Frontend), you can use ngrok to generate a public URL

```bash
# Install ngrok (if not already installed)
# Download from https://ngrok.com/download

# Expose sheets service dashboard
ngrok http 3003
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3001, 3002, 3003 are available
2. **Database connection**: Verify PostgreSQL is running and accessible
3. **Environment variables**: Check that all required env vars are set
4. **Build failures**: Ensure all dependencies are properly installed
