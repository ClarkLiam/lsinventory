Deploy-ready package

Copy the contents of this `deploy_ready` folder to your web host document root.

Layout (after copy):
- index.html
- css/styles.css
- js/*.js (app.js, api.js, auth.js, inventory.js, utils.js, plus other JS files if needed)
- api/index.php
- api/auth.php
- api/devices.php
- config.php
- backend/config/.env (create this file alongside the `backend` folder or edit `config.php` to include DB creds)
- .htaccess

Steps:
1. Upload all files preserving directories.
2. Ensure `backend/config/.env` exists and contains DB credentials (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET).
3. Ensure PHP has `pdo_mysql` enabled.
4. Visit https://inventory.lstudios-media.de/ and test API endpoints under `/api/`.

If you want me to produce a zip with only the files you need, tell me and I will create it.
