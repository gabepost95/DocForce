export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, email, documentType } = req.body;

  if (!amount || !email || !documentType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // ─── SIMULATED MODE (remove this block when Stripe is ready) ───
  if (!process.env.STRIPE_SECRET_KEY) {
    // Simulate a successful payment for testing
    return res.status(200).json({
      clientSecret: 'simulated_' + Date.now(),
      paymentId: 'sim_' + Math.random().toString(36).slice(2, 10),
      simulated: true,
    });
  }

  // ─── REAL STRIPE MODE ──────────────────────────────────────────
  try {
    const stripe = (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // amount in cents (e.g., 2900 = $29.00)
      currency: 'usd',
      receipt_email: email,
      metadata: {
        documentType: documentType,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentId: paymentIntent.id,
      simulated: false,
    });
  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: err.message });
  }
}
