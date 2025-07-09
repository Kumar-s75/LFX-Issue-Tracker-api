# LFX Issue Tracker

A Node.js/Express application for tracking and managing issues from Linux Foundation X (LFX) organizations.

## Features

- Fetch and filter LFX organizations
- Track GitHub issues from participating organizations
- Search for popular and unassigned issues
- RESTful API with comprehensive error handling
- Rate limiting and security middleware
- MongoDB integration for data persistence

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- GitHub Personal Access Token

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lfx-issue-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `DB_URL`: MongoDB connection string
- `GITHUB_TOKEN`: Your GitHub personal access token
- `FRONTEND_URL`: Frontend application URL
- `PORT`: Server port (default: 3000)

4. Build the project:
```bash
npm run build
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Organizations
- `GET /api/lfx/orgs` - Get filtered LFX organizations
- `GET /api/lfx/orgs/name` - Get organization names
- `GET /api/lfx/orgs/details` - Get organization details

### Issues
- `GET /api/lfx/issues` - Get unassigned issues
- `GET /api/lfx/issues/popular` - Get popular issues

### Data
- `GET /api/data/fetch` - Fetch general data

## Project Structure

```
src/
├── controllers/     # Request handlers
├── routes/         # API routes
├── services/       # Business logic
├── middleware/     # Custom middleware
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
├── config/         # Configuration files
└── db/            # Database connection
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC