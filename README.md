# UWDC 2025 - ActivePulse

### UWDC 2025 Competition, 7 hours in total

## Setting up development environment

Install dependencies:

```bash
npm i --force
```

Generate the Prisma types:
```bash
npx prisma generate
```

Run the database migrations? - optional:
```bash
npx prisma db push 
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building and Running for Production

Install dependencies:

```bash
npm i --force
```

Generate the Prisma types:
```bash
npx prisma generate
```

Run the database migrations? - optional:
```bash
npx prisma db push 
```

Build the application for production:

```bash
npm run build
```

Start the production server:
```bash
npm run start
```

The server should now be running at http://0.0.0.0:80

### Made by Peter Zaťko
