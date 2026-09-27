export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic, language } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'API Key सापडली नाही! Vercel Settings तपासा.' 
    });
  }

  const langMap = {
    mr: 'Marathi (मराठी)',
    hi: 'Hindi (हिंदी)',
    en: 'English'
  };

  const targetLang = langMap[language] || 'English';

  const systemPrompt = `You are an expert social media manager and copywriter.
Topic: "${topic}".
Language: Write completely in ${targetLang}.

Generate professional, high-engaging captions tailored for these 4 platforms:
1. Instagram: Engaging, trendy, visual-focused, with emojis and popular hashtags.
2. LinkedIn: Professional, insightful, career/business value with relevant hashtags.
3. Facebook: Conversational, community-oriented storytelling with emojis.
4. Twitter (X): Crisp, punchy, under 280 characters with a strong hook.

Also create a 3-5 word concise English photography prompt representing this topic visually.

Return response ONLY in this valid JSON format:
{
  "instagram": "Instagram caption text here",
  "linkedin": "LinkedIn caption text here",
  "facebook": "Facebook caption text here",
  "twitter": "Twitter (X) caption text here",
  "imagePrompt": "concise english visual prompt"
}`;

  // १. नवीन व सपोर्टेड मॉडेल निश्चित करणे
  const activeModel = 'models/gemini-3.8-flash';

  // २. निवडलेल्या मॉडेलद्वारे कॅप्शन जनरेट करणे
  try {
    const generateUrl = `https://generativelanguage.googleapis.com/v1beta/${activeModel}:generateContent?key=${apiKey}`;

    const response = await fetch(generateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.error?.message || 'Gemini API Error' 
      });
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      parsed = {
        instagram: rawText,
        linkedin: rawText,
        facebook: rawText,
        twitter: rawText,
        imagePrompt: topic
      };
    }

    // ३. हाय-क्वालिटी AI फोटो जनरेट करणे
    const seed = Math.floor(Math.random() * 900000) + 100000;
    const cleanPrompt = encodeURIComponent((parsed.imagePrompt || topic) + ' high quality 4k professional photography');
    const imageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=800&height=550&nologo=true&seed=${seed}`;

    return res.status(200).json({ 
      captions: {
        instagram: parsed.instagram || '',
        linkedin: parsed.linkedin || '',
        facebook: parsed.facebook || '',
        twitter: parsed.twitter || ''
      },
      imageUrl: imageUrl 
    });

  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
