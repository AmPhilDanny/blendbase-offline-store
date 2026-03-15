# BlendBase Offline Store

A production-ready Next.js application for a unisex clothing brand featuring offline/manual payments, Vercel Blob integrations, and an admin dashboard.

## Overview
- **Framework**: Next.js 15 (App Router)
- **Database**: SQLite (local) / PRISMA
- **Authentication**: Auth.js v5 (Credentials Provider)
- **Styling**: Tailwind CSS
- **Storage**: Vercel Blob

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update the `.env` with a secure random string for `AUTH_SECRET`. You can generate one with `openssl rand -base64 32`.

### 3. Database Setup
Initialize the SQLite database and Prisma client:
```bash
npx prisma generate
npx prisma db push
```

### 4. Vercel Blob (Optional for local, Required for Production)
If you want to test image uploads locally, you need a Vercel Blob store connected to your project.
Follow the guide here: https://vercel.com/docs/storage/vercel-blob/quickstart

### 5. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Key Features
- **Public Sandbox**: `/catalog`, `/product/[id]`, `/cart`, `/checkout`
- **Admin Sandbox**: `/admin` (Login with credentials specified in your `.env` file)
- **Cron Jobs**: Configured via `vercel.json` to clear old abandoned cart sessions daily.
- **Offline Payments**: Customers provide order details and upload proof-of-payment receipts, which admins then review and mark as "Paid".

## Deployment
This project is optimized for deployment on Vercel. 
1. Push your code to GitHub.
2. Import project in Vercel.
3. Add a Postgres Database and Vercel Blob from the Storage tab.
4. Set required Environment Variables (`AUTH_SECRET`, `AUTH_ADMIN_EMAIL`, `AUTH_ADMIN_PASSWORD`).
5. Deploy.
