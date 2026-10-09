# Database Seed Scripts

This directory contains scripts to seed the MongoDB database with test data.

## Seed Politician Profiles

This script adds 20 politician profiles to the database for testing purposes.

### Prerequisites

- MongoDB must be running
- MONGODB_URI environment variable must be set (or it will use localhost)

### How to Run

```bash
# From the project root directory
node scripts/seed-politicians.js
```

### What It Does

- Clears all existing businesses from the database
- Inserts 20 politician profiles with:
  - Name, contact number, email, website
  - Logo, address, description
  - Products & services
  - Initial ratings (4.8 to 3.6)
  - Total votes (690 to 1250)
  - Verification status (all verified)
  - Crown badges (top 10 have crowns)
  - Manual ranks (1 to 20)

### Note

This script will DELETE all existing businesses before inserting the new ones. Make sure you want to clear your database before running it.

If you want to keep existing data, comment out the `await Business.deleteMany({});` line in the script.
