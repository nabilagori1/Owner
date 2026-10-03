# Jam Sham Rooftop Cafe — Website & Management System

> **Rooftop evenings • Comfort food • Chai • Coffee • Good vibes**  
> 5th Floor, Zaver Chambers, Pandit Nehru Marg, Jamnagar, Gujarat

---

## 🚀 How to Deploy to Netlify via GitHub

### Step 1: Push Code to GitHub

Open your terminal or command prompt in this project folder and run:

```bash
# 1. Initialize git repository (if not already done)
git init

# 2. Stage all files
git add .

# 3. Create your initial commit
git commit -m "feat: complete Jam Sham Rooftop Cafe website & admin portal"

# 4. Set branch to main
git branch -M main

# 5. Link your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/jam-sham-rooftop.git

# 6. Push code to GitHub
git push -u origin main
```

---

### Step 2: Deploy on Netlify

1. Go to [Netlify.com](https://www.netlify.com) and log in or sign up (you can sign in directly with GitHub).
2. Click **"Add new site"** → **"Import an existing project"**.
3. Select **"GitHub"** and authorize Netlify.
4. Choose your repository: `jam-sham-rooftop`.
5. Netlify will automatically detect the settings from `netlify.toml`:
   - **Base directory**: *(leave empty)*
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **"Deploy jam-sham-rooftop"**.
7. In approximately 1 minute, your website will be live with a free SSL certificate (HTTPS) and a Netlify subdomain (e.g., `https://jam-sham-rooftop.netlify.app`)!

---

### Step 3: (Optional) Connect Custom Domain

1. In your Netlify dashboard, navigate to **Site configuration** → **Domain management**.
2. Click **Add custom domain** (e.g., `jamshamrooftop.com`).
3. Follow the DNS instructions to point your domain CNAME or A records to Netlify. Netlify will automatically provision a free Let's Encrypt SSL certificate.

---

## 🔑 Admin Portal Credentials

- **Portal URL**: `/admin` (or click **"Owner Admin"** in the top navigation bar)
- **Default Username**: `admin` *(or `jamsham_owner`)*
- **Default Password**: `jamsham@2024` *(or `admin123`)*

*Note: You can update your admin username and password anytime directly in the Admin Portal under the **Settings & Password** tab.*

---

## 🌟 Key Features Built

- **Old Money & Rooftop Aesthetics**: Custom calligraphy handwriting intro animation for "Jam Sham Rooftop", warm linen/cream/navy palette.
- **30+ Category Digital Menu**: 100% pure vegetarian dishes with Indian pricing (INR ₹).
- **Online Ordering System**: Dine-In (with table #), Takeaway, and Home Delivery with live status tracking (#JSR-XXXX).
- **Table Reservation System**: Guests can book terrace tables by party size, occasion, and seating preference.
- **Dedicated Kitchen Display System (KDS)**: Tablet-friendly Kanban order dispatch board at `/kitchen`.
- **Owner Admin Console**: Full customer orders ledger, live table bookings manager, customer CRM, printable KOT invoices, table QR code generators, and menu controls.
- **Location & WhatsApp Integration**: Google Maps navigation to Pandit Nehru Marg Jamnagar, call buttons, and floating WhatsApp assistant.
