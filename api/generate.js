import { GoogleGenerativeAI } from "@google/generative-ai";

// Vercel मधील तुमची नवीन API Key
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { 
      topic, language, platform, tone, length, 
      useHashtags, useEmojis, channelName, videoFormat 
    } = req.body;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key is missing in Vercel settings.' });
    }

    // तुम्ही सांगितलेले मॉडेल: gemini-3.8-flash
    const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });
    
    let prompt = "";
    const isAllInOne = platform === 'all';

    // 1. All in One निवडल्यास (JSON आउटपुट)
    if (isAllInOne) {
      prompt = `
        You are an expert social media manager. Create highly engaging content for the topic: "${topic}".
        Output Language: ${language} ('mr' for Marathi, 'hi' for Hindi, 'en' for English. STICK STRICTLY TO THIS LANGUAGE).
        Tone: ${tone}. Length: ${length}.
        Include Emojis: ${useEmojis}. Include Hashtags: ${useHashtags}.
        YouTube Specifics: Mention channel "${channelName || 'my channel'}" and format for ${videoFormat} video.
        
        CRITICAL RULE: You must output ONLY a valid JSON object containing captions customized for each platform. Do not include any text outside the JSON. Do not use markdown blocks like \`\`\`json.
        Format:
        {
          "youtube": "YouTube Video Description here...",
          "instagram": "Instagram Post here...",
          "linkedin": "LinkedIn Professional Post here...",
          "facebook": "Facebook Post here...",
          "twitter": "Short Twitter Post here..."
        }
      `;
    } 
    // 2. सिंगल प्लॅटफॉर्म निवडल्यास
    else {
      let targetFormat = platform;
      if (platform === 'youtube_title') {
          targetFormat = "ONLY a highly clickable YouTube Video Title. Do not write a description.";
      }
      
      prompt = `
        You are an expert social media manager. Create content for the topic: "${topic}".
        Target Platform/Format: ${targetFormat}
        Output Language: ${language} ('mr' for Marathi, 'hi' for Hindi, 'en' for English).
        Tone: ${tone}. Length: ${length}.
        Include Emojis: ${useEmojis}. Include Hashtags: ${useHashtags}.
        ${platform.includes('youtube') ? `YouTube Specifics: Mention channel "${channelName || 'my channel'}" and format for ${videoFormat} video.` : ''}

        CRITICAL RULE: Output ONLY the final text. Do not add conversational filler.
      `;
    }

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    let finalCaptions = {};

    if (isAllInOne) {
      // JSON मधील अतिरिक्त markdown काढून टाकणे
      responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      finalCaptions = JSON.parse(responseText);
    } else {
      const key = platform === 'youtube_title' ? 'youtube' : platform;
      finalCaptions[key] = responseText;
    }

    res.status(200).json({ captions: finalCaptions });

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: 'Failed to generate caption.', details: error.message });
  }
      }
