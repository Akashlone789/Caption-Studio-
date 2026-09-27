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

  // वापरण्यासाठी मॉडेल्सची यादी (प्राधान्यानुसार)
  const models = [
    'models/gemini-3.8-flash',
    'models/gemini-2.0-flash',
    'models/gemini-1.5-flash'
  ];

  let rawText = null;
  let lastErrorMessage = '';

  // मॉडेल्सवर आळीपाळीने प्रयत्न करणे
  for (const model of models) {
    let attempts = 0;
    // प्रत्येक मॉडेलसाठी २ वेळा प्रयत्न (Retry)
    while (attempts < 2) {
      try {
        const generateUrl = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`;

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

        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          rawText = data.candidates[0].content.parts[0].text;
          break; // यशस्वी रिस्पॉन्स मिळाला
        }

        // ५०३ किंवा High demand असल्यास १.५ सेकंद थांबा आणि पुन्हा प्रयत्न करा
        if (response.status === 503 || data.error?.message?.includes('high demand')) {
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 1500));
          continue;
        } else {
          lastErrorMessage = data.error?.message || 'API Error';
          break; // इतर एरर असल्यास पुढील मॉडेलकडे वळा
        }
      } catch (err) {
        attempts++;
        lastErrorMessage = err.message;
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }

    if (rawText) break; // कॅप्शन मिळाल्यास लूप थांबवा
  }

  // जर सर्व मॉडेल्स बिझी असतील तरच एरर पाठवा
  if (!rawText) {
    return res.status(503).json({
      error: `सर्व्हरवर जास्त लोड आहे, कृपया थोड्या वेळाने प्रयत्न करा. (${lastErrorMessage})`
    });
  }

  // JSON पार्स करणे
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

  // AI फोटो URL तयार करणे
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
}
