import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key is missing in Vercel settings.' });
    }

    const { 
      topic, language = 'mr', platform, tone, length, 
      useHashtags, useEmojis, channelName, videoFormat 
    } = req.body;

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const isAllInOne = platform === 'all';

    // JSON आउटपुट खात्रीशीर करण्यासाठी generationConfig जोडले आहे
    const generationConfig = isAllInOne 
      ? { responseMimeType: "application/json" } 
      : {};

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig 
    });
    
    let prompt = "";

    // 1. All in One निवडल्यास (JSON आउटपुट)
    if (isAllInOne) {
      prompt = `
        You are an expert social media manager. Create highly engaging content for the topic: "${topic}".
        Output Language: ${language} ('mr' for Marathi, 'hi' for Hindi, 'en' for English. STICK STRICTLY TO THIS LANGUAGE).
        Tone: ${tone}. Length: ${length}.
        Include Emojis: ${useEmojis}. Include Hashtags: ${useHashtags}.
        YouTube Specifics: Mention channel "${channelName || 'my channel'}" and format for ${videoFormat} video.
        
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
        ${platform && platform.includes('youtube') ? `YouTube Specifics: Mention channel "${channelName || 'my channel'}" and format for ${videoFormat} video.` : ''}

        CRITICAL RULE: Output ONLY the final text. Do not add conversational filler.
      `;
    }

    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    let finalCaptions = {};

    if (isAllInOne) {
      // सुरक्षेसाठी अतिरिक्त markdown काढून टाकणे
      responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      finalCaptions = JSON.parse(responseText);
    } else {
      const key = platform === 'youtube_title' ? 'youtube' : platform;
      finalCaptions[key] = responseText;
    }

    return res.status(200).json({ captions: finalCaptions });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: 'Failed to generate caption.', details: error.message });
  }
}
