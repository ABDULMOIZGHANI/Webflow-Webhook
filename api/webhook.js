// api/webhook.js
// Vercel Serverless Function
// Receives Webflow form submission → saves to Webflow CMS → auto-publishes

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body;

    console.log("📥 Incoming Webflow form data:", body);

    // ─────────────────────────────────────────────
    // STEP 1: Parse the form fields from Webflow
    // Webflow sends form data as: { data: { "field-name": "value" } }
    // ─────────────────────────────────────────────
    const formData = body.payload?.data || body.data || body;

    const name = formData["name"] || formData["Name"] || "";
    const email = formData["email"] || formData["Email"] || "";
    const phone = formData["phone"] || formData["Phone"] || "";
    const message = formData["message"] || formData["Message"] || "";
    const service = formData["service"] || formData["Service"] || "";

    if (!name || !email) {
      return res.status(400).json({ error: "Missing required fields: name and email" });
    }

    // ─────────────────────────────────────────────
    // STEP 2: Create CMS item in Webflow
    // ─────────────────────────────────────────────
    const cmsItem = await createWebflowCMSItem({
      name,
      email,
      phone,
      message,
      service,
    });

    console.log("✅ CMS item created:", cmsItem.id);

    // ─────────────────────────────────────────────
    // STEP 3: Publish the CMS item so it shows on frontend
    // ─────────────────────────────────────────────
    await publishWebflowCMSItem(cmsItem.id);

    console.log("🚀 CMS item published successfully");

    return res.status(200).json({
      success: true,
      message: "Lead saved and published to Webflow CMS",
      itemId: cmsItem.id,
    });

  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATE CMS ITEM
// ─────────────────────────────────────────────────────────────────────────────
async function createWebflowCMSItem({ name, email, phone, message, service }) {
  const WEBFLOW_API_TOKEN = process.env.WEBFLOW_API_TOKEN;
  const WEBFLOW_COLLECTION_ID = process.env.WEBFLOW_COLLECTION_ID;

  const url = `https://api.webflow.com/v2/collections/${WEBFLOW_COLLECTION_ID}/items`;

  const payload = {
    isArchived: false,
    isDraft: false,
    fieldData: {
  name: name,
  slug: generateSlug(name + "-" + Date.now()),
  "lead-name": name,
  "lead-email": email,
},
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WEBFLOW_API_TOKEN}`,
      "Content-Type": "application/json",
      "accept-version": "2.0.0",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Webflow CMS create failed: ${err}`);
  }

  return await response.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLISH CMS ITEM (so it appears live on the frontend)
// ─────────────────────────────────────────────────────────────────────────────
async function publishWebflowCMSItem(itemId) {
  const WEBFLOW_API_TOKEN = process.env.WEBFLOW_API_TOKEN;
  const WEBFLOW_COLLECTION_ID = process.env.WEBFLOW_COLLECTION_ID;

  const url = `https://api.webflow.com/v2/collections/${WEBFLOW_COLLECTION_ID}/items/publish`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WEBFLOW_API_TOKEN}`,
      "Content-Type": "application/json",
      "accept-version": "2.0.0",
    },
    body: JSON.stringify({ itemIds: [itemId] }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Webflow publish failed: ${err}`);
  }

  return await response.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Generate URL-safe slug
// ─────────────────────────────────────────────────────────────────────────────
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 60);
}

