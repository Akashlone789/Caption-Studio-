import { GoogleGenerativeAI } from "@google/generative-ai";

// तुमच्या .env फाईलमधील Gemini API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // फ्रंटएंडवरून येणारा सर्व डेटा (नवीन पर्यायांसह)
      const { 
        topic, language, platform, tone, length, 
        useHashtags, useEmojis, channelName, videoFormat 
      } = req.body;

      // Gemini ला देण्यासाठी डायनॅमिक प्रॉम्प्ट तयार करणे
      const prompt = `
        You are an expert social media manager. Create a highly engaging content based on the following details:
        
        - Topic: "${topic}"
        - Target Platform: ${platform} (If youtube_title, write ONLY a catchy title)
        - Output Language: ${language} (Output strictly in this language: 'mr' for Marathi, 'hi' for Hindi, 'en' for English)
        - Tone of Voice: ${tone}
        - Content Length: ${length}
        - Emojis: ${useEmojis ? 'Include appropriate emojis' : 'Do NOT use emojis'}
        - Hashtags: ${useHashtags ? 'Include relevant trending hashtags at the end' : 'Do NOT use hashtags'}
        
        ${platform === 'youtube' || platform === 'all' ? `
        - YouTube Specifics: Mention "Welcome to ${channelName || 'my channel'}" and format it for a ${videoFormat} video. Ask viewers to like and subscribe.
        ` : ''}

        Rules:
        1. Give ONLY the final caption/title text.
        2. Do NOT write conversational filler like "Here is your caption:" or "Sure!".
        3. Do NOT use markdown code blocks like \`\`\`.
      `;

      // Gemini मॉडेल निवडणे (Free tier साठी gemini-1.5-flash उत्तम आहे)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // जर platform 'all' असेल, तर तुम्हाला JSON फॉरमॅटमध्ये वेगवेगळ्या प्लॅटफॉर्म्ससाठी कॅप्शन वेगळे करावे लागेल. 
      // पण सध्या आपण सिंगल टेक्स्ट परत पाठवत आहोत:
      res.status(200).json({ 
        captions: {
          [platform === 'all' ? 'youtube' : platform]: responseText 
        } 
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate caption' });
    }
  }
}
