# Feedback Management System

A modern REST API system for managing feedback data with comprehensive CRUD operations and analytics.

## Features

- **Feedback Management**: Create, read, update, and delete feedback records
- **Rating System**: Support for multiple rating criteria with numerical scores
- **Analytics**: Get comprehensive statistics on feedback ratings
- **Validation**: Robust data validation using Zod schemas
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
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   └── index.ts      # Application entry point
```

## Usage

1. **Start the Development Server**:

```bash
npm run dev    # Development mode
```

2. **Build for Production**:

```bash
npm run build  # Build for production
npm start      # Run production build
```

## API Routes

- `/api/feedback` - Feedback management
  - `GET /api/feedback` - Get all feedback
  - `POST /api/feedback` - Create new feedback
  - `GET /api/feedback/:id` - Get feedback by ID
  - `PUT /api/feedback/:id` - Update feedback
  - `DELETE /api/feedback/:id` - Delete feedback
  - `GET /api/feedback/stats` - Get feedback statistics

## API Documentation

Access the Swagger documentation at: `http://localhost:3000/api-docs`

## Feedback Model

Each feedback record contains:

- **subject**: The subject or topic of the feedback
- **comment**: Detailed feedback text
- **ratings**: Object containing numerical ratings for different criteria
- **createdAt/updatedAt**: Automatic timestamps

Example feedback structure:

```json
{
  "subject": "Performance Review",
  "comment": "Great job on the presentation",
  "ratings": {
    "communication": 4,
    "technical_skills": 5,
    "teamwork": 4
  }
}
```

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

## Testing

Test the API endpoints using the included test file:

```bash
npx ts-node test-feedback.ts
```

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
