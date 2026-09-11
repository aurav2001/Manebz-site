# MANABS Enterprise Backend (Node.js + Express + MySQL)

Enterprise REST API backend for MANABS Facilities & Workforce Management portal.

---

## 🛠️ Tech Stack
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MySQL (via `mysql2/promise`)
- **Security:** Helmet, CORS
- **Logging:** Morgan

---

## 📁 Directory Structure
```
backend/
├── config/
│   └── db.js             # MySQL Connection Pool & auto-table migration
├── controllers/
│   ├── inquiryController.js   # Proposals & leads
│   ├── careerController.js    # Job applications & candidates
│   ├── contactController.js   # Contact messages
│   ├── pageController.js      # Dynamic CMS pages
│   └── settingsController.js  # Global settings
├── routes/
│   ├── inquiryRoutes.js
│   ├── careerRoutes.js
│   ├── contactRoutes.js
│   ├── pageRoutes.js
│   ├── settingsRoutes.js
│   └── api.js                 # Centralized API router & health check
├── schema/
│   └── schema.sql        # MySQL table schema
├── .env                  # Active database configuration
├── .env.example          # Environment template
├── package.json
└── server.js             # Express application entry
```

---

## 🚀 Local Development Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure `.env`:**
   Set your local MySQL credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=manabs_db
   ```

3. **Start the Server:**
   ```bash
   npm start
   # or with auto-reload:
   npm run dev
   ```

4. **Verify Health:**
   Visit `http://localhost:5000/api/health` in your browser.

---

## 🌐 cPanel Deployment Guide

### Option 1: Using cPanel "Setup Node.js App" (Recommended)
1. **Create MySQL Database in cPanel:**
   - Go to **MySQL Databases** or **MySQL Database Wizard**.
   - Create a database (e.g., `user_manabs_db`).
   - Create a database user and assign all privileges to the database.
   - *(Optional)* In phpMyAdmin, you can import `schema/schema.sql` (or let `db.js` auto-create tables).

2. **Upload Backend:**
   - Compress the `backend` folder (excluding `node_modules`).
   - In cPanel **File Manager**, upload and extract it into a folder like `/home/username/manabs_api`.

3. **Setup Node.js App in cPanel:**
   - Search for **"Setup Node.js App"** in cPanel.
   - Click **Create Application**.
   - **Node.js version:** Select `18.x`, `20.x`, or latest.
   - **Application root:** `manabs_api` (or your folder path).
   - **Application URL:** `api` or a subdomain `api.manabs.com`.
   - **Application startup file:** `server.js`.
   - Click **Create**.
   - Click **Run NPM Install**.
   - In the **Environment variables** section, add:
     - `DB_HOST`: `localhost`
     - `DB_USER`: `your_cpanel_db_user`
     - `DB_PASSWORD`: `your_cpanel_db_password`
     - `DB_NAME`: `your_cpanel_db_name`
   - Click **Restart Application**.
