# LS-Inventory Setup Guide

## 1) Prerequisites
- Node.js 20+
- PostgreSQL 14+
- npm

## 2) Clone and install
```bash
git clone https://github.com/ClarkLiam/lsinventory.git
cd lsinventory
cd backend
npm install
```

## 3) Configure environment
```bash
cp config/.env.example config/.env
```
Update values in `backend/config/.env`.

## 4) Initialize database
```bash
psql -U <user> -d <database> -f ../database/schema.sql
```

## 5) Start backend
```bash
npm run dev
```

## 6) Serve frontend
Serve `frontend/public` from your web host or locally with any static server.

> TODO: Add docker-compose and production reverse proxy examples.
