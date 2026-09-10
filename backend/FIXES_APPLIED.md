# In-Stock Backend Fixes

## Startup crash fixed

The backend was crashing during startup because `routes/auth.js` created an Express router but never exported it. `require('./routes/auth')` therefore returned an object instead of a router, and Express 5 threw:

`TypeError: argument handler must be a function`

The auth router is now exported correctly.

## Authentication fixes

- Added the missing `POST /api/auth/signup` endpoint used by the frontend.
- Added basic signup validation.
- Added duplicate-email handling.
- Normalized email addresses to lowercase.
- Kept password hashing with bcrypt.
- Kept JWT authentication and the existing 7-day token lifetime.

## Server stability fixes

- Added an explicit 404 JSON response.
- Added Express error-handling middleware.
- Added PostgreSQL pool error handling so idle connection errors are logged instead of becoming unhandled events.
- Added graceful shutdown for SIGINT/SIGTERM.
- Added a configurable `PORT` environment variable with 5050 as the default.
- Added a small JSON body-size limit.
- Improved database-test error handling.

## Stock movement fix

Stock movements are committed before notification creation. Notification creation is now isolated so a notification/database problem cannot make an already-committed stock movement appear to have failed.

## Database note

The supplied `.env` points PostgreSQL to `localhost:5432` with database `instock`. The code was tested for startup, but the PostgreSQL database was not running in the test environment, so `/api/db-test` returned `ECONNREFUSED`.

If your local PostgreSQL service is stopped, start PostgreSQL before using inventory features.
