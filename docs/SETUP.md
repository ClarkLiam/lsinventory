# LS-Inventory Setup Guide

## 1) Prerequisites
- Node.js 20+
- MySQL 8.0+
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

## 4) Create and initialize MySQL database
```bash
mysql -u root -p
```

```sql
CREATE DATABASE ls_inventory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'lsinventory'@'localhost' IDENTIFIED BY 'replace_with_secure_password';
GRANT ALL PRIVILEGES ON ls_inventory.* TO 'lsinventory'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

```bash
mysql -u lsinventory -p ls_inventory < ../database/schema.mysql.sql
```

## 5) Start backend
```bash
npm run dev
```

## 6) Serve frontend
Serve `frontend/public` from your web host or locally with any static server.

> TODO: Add docker-compose and production reverse proxy examples.
