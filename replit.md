# All About Resume

## Overview

All About Resume (formerly RDS Resume Checker) is a free, AI-powered resume analysis service that evaluates resumes for ATS (Applicant Tracking System) compatibility and overall quality. Users upload their resume (PDF or DOCX, under 2MB), and the system analyzes it across 16 key checks organized into 5 categories: Content, Format, Skills, Sections, and Style. The application provides instant feedback with scores, grades, and actionable improvement suggestions, with optional email delivery of detailed results.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component System**: Shadcn UI ("new-york" style) with Radix UI primitives
- Provides a comprehensive design system inspired by Linear and Grammarly
- Uses Tailwind CSS for styling with CSS custom properties for theming
- Supports both light and dark modes via ThemeProvider context

**Routing**: Wouter for lightweight client-side routing
- Two main routes: Home (upload) and Results (analysis display)

**State Management**: TanStack Query (React Query) for server state management
- Handles data fetching, caching, and synchronization
- Custom query client with configured defaults for consistent behavior

**Design Philosophy**: Professional productivity tool focused on trust, clarity, and efficiency
- Typography: Inter font family for UI, Fira Code for monospace (scores/data)
- Color palette: Vibrant blue primary (trust/professionalism), semantic colors for pass/warning/fail states
- Consistent spacing units (4, 6, 8, 12, 16, 24) and container width hierarchy

### Backend Architecture

**Server Framework**: Express.js running on Node.js

**API Structure**: RESTful endpoints
- `POST /api/analyze`: Accepts multipart/form-data with resume file, returns analysis ID
- `GET /api/results/:id`: Retrieves stored analysis results
- `POST /api/results/:id/email`: Sends analysis results via email

**File Processing Pipeline**:
1. Multer middleware for file upload handling (2MB limit, PDF/DOCX only)
2. File parsing service extracts text from uploaded documents
   - PDF: Uses pdf-parse library
   - DOCX: Uses mammoth library
3. Text validation (minimum 50 characters)
4. OpenAI analysis service evaluates resume content
5. Results storage and ID generation

**AI Integration**: OpenAI GPT-5 for resume analysis
- Structured prompt engineering for consistent 16-check evaluation across 5 categories
- Returns JSON-formatted analysis with scores, grades, status indicators, and improvement suggestions
- Categories: Content (ATS parsing, repeated words, grammar, quantified achievements), Format (file type, length, bullet points), Skills (hard/soft/relevance), Sections (contact info, essential sections, personality), Style (design, active voice, buzzwords)

### Data Storage

**Current Implementation**: In-memory storage (MemStorage class)
- Analysis results stored in Map data structure with UUID keys
- Ephemeral storage suitable for development/testing

**Schema Design**: Drizzle ORM schema defined for PostgreSQL migration
- `resume_analyses` table structure prepared for persistent storage
- Fields: id, fileName, fileSize, email (optional), parsedText, analysisResult (JSONB), createdAt
- PostgreSQL dialect configured via Drizzle Kit

**Migration Path**: Application designed to transition from in-memory to PostgreSQL
- Storage interface abstraction (IStorage) allows swapping implementations
- Neon serverless PostgreSQL driver included as dependency
- Environment variable DATABASE_URL required for production deployment

### External Dependencies

**AI Service**: OpenAI API (GPT-5 model)
- Requires OPENAI_API_KEY environment variable
- Structured prompts for resume evaluation
- JSON response parsing for analysis results

**Email Service**: Nodemailer
- Currently configured with test accounts for development
- Generates preview URLs for sent emails during development
- HTML email templating for formatted analysis delivery
- Production deployment requires SMTP configuration

**File Processing Libraries**:
- pdf-parse: PDF text extraction
- mammoth: DOCX text extraction
- multer: Multipart form data handling

**Database**: PostgreSQL via Neon serverless
- Connection managed through @neondatabase/serverless
- Drizzle ORM for schema definition and migrations
- Currently optional (in-memory fallback available)

**Development Tools**:
- Replit-specific plugins for enhanced development experience
- Runtime error overlay
- Cartographer for code navigation
- Dev banner for development environment indication

**TypeScript Configuration**: Strict mode enabled with ESNext module system
- Path aliases for clean imports (@/, @shared/, @assets/)
- Bundler module resolution for modern tooling compatibility