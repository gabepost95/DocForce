export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt, paymentId } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Demo mode — return a placeholder
    return res.status(200).json({
      text: `[DEMO MODE — Add ANTHROPIC_API_KEY to Vercel environment variables]\n\nYour document would be generated here with full professional content.\n\nTo enable real generation:\n1. Go to console.anthropic.com and get an API key\n2. Add it as ANTHROPIC_API_KEY in Vercel → Settings → Environment Variables\n3. Redeploy your project`,
      demo: true,
    });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Anthropic API error: ${response.status} — ${err}`);
    }

    const data = await response.json();
    const text = data.content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join('\n');

    return res.status(200).json({ text, demo: false });
  } catch (err) {
    console.error('Generation error:', err);
    return res.status(500).json({ error: err.message });
  }
}
