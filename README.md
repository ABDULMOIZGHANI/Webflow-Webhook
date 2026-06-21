# 🚀 Houstonopolis Creative — Webflow Agentic Webhook

A zero-cost serverless workflow that automatically saves Webflow form submissions to your CMS and publishes them live on the frontend — no Zapier, Make, or n8n needed.

---

## 🔁 How It Works

```
User fills Webflow Form
        ↓
Webflow sends POST webhook to your Vercel URL
        ↓
Vercel API parses the form data
        ↓
Creates a new item in your Webflow CMS Collection (e.g. "Leads")
        ↓
Publishes it instantly → shows live on your Webflow frontend
```

---

## 📁 Project Structure

```
webflow-webhook/
├── api/
│   └── webhook.js       ← Main serverless function (runs on Vercel)
├── .env.example         ← Environment variables template
├── .gitignore
├── package.json
├── vercel.json          ← Vercel configuration
└── README.md
```

---

## ⚙️ Setup Guide

### Step 1 — Create a CMS Collection in Webflow

1. Go to your Webflow project → **CMS**
2. Create a new collection called **"Leads"**
3. Add these fields:
   - `lead-name` → Plain Text
   - `lead-email` → Plain Text
   - `lead-phone` → Plain Text
   - `lead-message` → Plain Text (Long)
   - `lead-service` → Plain Text
   - `submitted-at` → Plain Text
   - `status` → Plain Text (default: "New")
4. Copy the **Collection ID** from CMS → Settings

---

### Step 2 — Get Your Webflow API Token

1. Go to **Webflow Dashboard → Account Settings → Integrations → API Access**
2. Click **Generate API Token**
3. Copy the token

---

### Step 3 — Deploy to Vercel (Free)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from project folder
cd webflow-webhook
vercel --prod
```

Your live URL will be:
```
https://your-project-name.vercel.app/api/webhook
```

---

### Step 4 — Add Environment Variables in Vercel

1. Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**
2. Add:
   - `WEBFLOW_API_TOKEN` = your token
   - `WEBFLOW_COLLECTION_ID` = your collection ID

---

### Step 5 — Connect Webflow Form to Your Webhook

1. In Webflow Designer, select your **Form**
2. Go to **Form Settings**
3. Under **Action**, paste your Vercel URL:
   ```
   https://your-project-name.vercel.app/api/webhook
   ```
4. Set method to **POST**
5. Publish your Webflow site

---

### Step 6 — Display Leads on Frontend (Optional)

In Webflow, add a **Collection List** element bound to your **Leads** collection. Style it however you like — every new form submission will automatically appear here.

---

## ✅ Form Field Names

Make sure your Webflow form fields use these exact names (or update `webhook.js`):

| Form Field | CMS Field |
|---|---|
| `name` | `lead-name` |
| `email` | `lead-email` |
| `phone` | `lead-phone` |
| `message` | `lead-message` |
| `service` | `lead-service` |

---

## 💰 Cost

| Service | Cost |
|---|---|
| Vercel Hosting | **Free** (Hobby plan — 100GB bandwidth) |
| Webflow CMS | Included in your Webflow plan |
| Zapier / Make / n8n | **Not needed** ✅ |

---

## 🛠 Customization

Want to extend this? You can easily add:
- **Email notification** → add SendGrid or Resend API call inside `webhook.js`
- **Slack alert** → POST to a Slack webhook when a new lead comes in
- **Google Sheets logging** → add Google Sheets API call
- **AI lead scoring** → call Claude API to auto-score leads by message quality

All inside one `webhook.js` file, zero extra cost.

---

## 👨‍💻 Built by Abdul Moiz
For Houstonopolis Creative — Webflow + Vercel agentic workflow
