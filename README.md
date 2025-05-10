# Test Administration System

A comprehensive system for managing medical test administrations, including tracks, stations, and participants (examinees, examiners, and standardized clients).

## Features

- **Administration Management**: Create and manage test administrations
- **Track & Station Organization**: Organize tests into tracks and stations
- **Participant Management**: 
  - Examinees (test takers)
  - Examiners (evaluators)
  - Standardized Clients (actors/participants)
- **Data Import**: Bulk upload participants via CSV files
- **API Documentation**: Swagger/OpenAPI documentation
- **Database**: MongoDB storage with Mongoose ODM

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- TypeScript (v4.8 or higher)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/maxfame-test
```

## Project Structure

```
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── models/        # MongoDB schemas
│   ├── project_files/ # CSV templates and admin configurations
│   ├── routes/        # API routes
│   ├── scripts/       # Setup and utility scripts
│   └── index.ts      # Application entry point
```

## Setup

1. **Initial Setup**: Run the setup script to initialize the database with test administrations and import participant data:
```bash
npm run setup        # Basic setup
npm run setup:clear  # Clear existing data first
npm run setup:prod   # Production environment setup
```

2. **Start the Server**:
```bash
npm run dev    # Development mode
npm run build  # Build for production
npm start      # Run production build
```

## API Routes

- `/api/administrations` - Test administration management
- `/api/tracks` - Track management
- `/api/stations` - Station management
- `/api/examinees` - Examinee management
- `/api/examiners` - Examiner management
- `/api/clients` - Standardized client management

## API Documentation

Access the Swagger documentation at: `http://localhost:3000/api-docs`

## Data Import

The system supports CSV imports for:
- Examinees
- Examiners
- Standardized Clients

CSV templates are available in the `src/project_files` directory.

## Administration Structure

Each test administration consists of:
- Multiple tracks
- Each track contains multiple stations
- Stations are assigned:
  - Examinees (test takers)
  - Examiners (evaluators)
  - Standardized Clients (actors)

## Development

1. **Run in Development Mode**:
```bash
npm run dev
```

2. **Build for Production**:
```bash
npm run build
```

3. **Check TypeScript Compilation**:
```bash
tsc --noEmit
```

## Database Models

- `Administration`: Test administration sessions
- `Track`: Groups of stations within an administration
- `Station`: Individual test stations
- `Examinee`: Test takers
- `Examiner`: Test evaluators
- `Client`: Standardized clients/actors
- `Rotation`: Station assignments and scheduling

## File Upload

The system accepts:
- CSV files for participant data
- Excel files (XLSX) for bulk imports
- Structured JSON for administration templates

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT

## Author

Gideon Omachi <gideonomachi@gmail.com>
