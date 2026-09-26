import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Image as ImageIcon,
  Globe,
  RefreshCw,
  Share2,
  Volume2,
  VolumeX,
  Smartphone,
  Maximize2,
  Wand2,
  Hash,
  Download,
  Flame,
  CheckCircle2,
  Info,
  ChevronDown,
  Layers,
  Heart
} from "lucide-react";

const PRESETS = [
  {
    id: "festival",
    label: "Festival / सण",
    icon: "🪔",
    topic: {
      en: "Diwali festival lights, sweets, and joy with family",
      hi: "दिवाली के दीप, खुशियां और परिवार के साथ उत्सव",
      mr: "गणेशोत्सव आणि दिवाळीची मंगलमय पहाट, आनंद आणि ऊर्जा"
    },
    imageTheme: "festival lights diwali lantern celebration vibrant"
  },
  {
    id: "chai",
    label: "Chai & Monsoon / चहा",
    icon: "☕",
    topic: {
      en: "Monsoon rain with steaming hot ginger cutting chai",
      hi: "रिमझिम बारिश और गरमा-गरम अदरक वाली चाय की चुस्की",
      mr: "बाहेर पडणारा मुसळधार पाऊस आणि हातात वाफाळलेला आल्याचा चहा"
    },
    imageTheme: "steaming hot tea glass monsoon rain moody cozy"
  },
  {
    id: "trek",
    label: "Trek & Nature / निसर्ग",
    icon: "⛰️",
    topic: {
      en: "Sahyadri mountain trek with morning fog and greenery",
      hi: "पहाड़ों की खूबसूरत वादियों में सुबह की ताजगी और ट्रेकिंग",
      mr: "सह्याद्रीच्या कुशीतील किल्ला भ्रमंती, हिरवेगार डोंगर आणि धुक्याची चादर"
    },
    imageTheme: "mountain misty green hills lush nature sunrise"
  },
  {
    id: "fitness",
    label: "Fitness / कसरत",
    icon: "💪",
    topic: {
      en: "Early morning intense gym workout and relentless discipline",
      hi: "सुबह की कड़ी मेहनत, पसीना और कभी हार न मानने का जज्बा",
      mr: "सकाळचा व्यायाम, घाम आणि स्वतःला घडवण्याची जिद्द"
    },
    imageTheme: "fitness gym workout dumbbell aesthetic cinematic"
  },
  {
    id: "tech",
    label: "Tech & AI / तंत्रज्ञान",
    icon: "🚀",
    topic: {
      en: "Future of AI and building game-changing software products",
      hi: "भविष्य की तकनीक, नए आविष्कार और डिजिटल भारत की क्रांति",
      mr: "नवीन तंत्रज्ञान, कृत्रिम बुद्धिमत्ता आणि प्रगतीची नवी क्षितिजे"
    },
    imageTheme: "modern technology future neon clean minimalist workspace"
  }
];

const OFFLINE_TEMPLATES = {
  mr: [
    {
      caption: "आयुष्यात प्रत्येक क्षण खास असतो, फक्त तो जगण्याची जिद्द आणि चेहऱ्यावर एक गोड हसू हवं! ✨ संकटांवर मात करत पुढे जाण्यातच खरी मजा आहे. जय महाराष्ट्र! 🚩",
      hashtags: ["#मराठीसंस्कृती", "#सकारात्मक_विचार", "#जिद्द", "#महाराष्ट्र", "#नवीनसुरुवात"],
      imageQuery: "traditional maharashtra fort sunrise sahyadri cinematic"
    },
    {
      caption: "बाहेर कोसळणारा धो-धो पाऊस आणि हातात वाफाळलेला गरमागरम चहा... बाकी सगळ्या जगाचा विसर पडायला एवढंच पुरेसं आहे! ☕🌧️ निसर्गाच्या या जादूई रूपाला तोड नाही.",
      hashtags: ["#चहाप्रेमी", "#पावसाळा", "#निसर्गसुख", "#महाराष्ट्रडायरी", "#MonsoonVibes"],
      imageQuery: "monsoon tea cutting glass window raindrops"
    },
    {
      caption: "बाप्पाच्या चरणी नतमस्तक होऊन नवीन दिवसाची सुरुवात करूया. सुख, समाधान आणि यश तुमच्या पावलावर सदैव राहो! 🙏🌸 मोरया!",
      hashtags: ["#गणपतीबाप्पा", "#मंगलमूर्ती", "#भक्ती", "#सणउत्सव", "#BappaMorya"],
      imageQuery: "ganesha traditional diya brass artistic spiritual"
    }
  ],
  hi: [
    {
      caption: "हौसले बुलंद हों तो हर राह आसान हो जाती है। अपने सपनों का पीछा तब तक करो जब तक वो हकीकत में न बदल जाएं! 🌟 रुकना नहीं, बस आगे बढ़ते जाना है।",
      hashtags: ["#सफलता", "#मेहनत", "#सकारात्मकता", "#जिंदगी", "#NewBeginnings"],
      imageQuery: "motivational sunrise runner silhouette path golden hour"
    },
    {
      caption: "दीयों की रोशनी और अपनों की हंसी... जिंदगी के असली रंग तो खुशियों को बांटने में ही हैं! 🪔✨ आपके जीवन में हमेशा रोशनी और प्यार बना रहे।",
      hashtags: ["#खुशियां", "#त्योहार", "#उम्मीद", "#परिवार", "#FestiveVibes"],
      imageQuery: "diwali clay diyas warm glow flowers rangoli"
    },
    {
      caption: "सुबह की पहली चाय और थोड़ी सी खामोशी... कभी-कभी सुकून की तलाश एक कप में ही पूरी हो जाती है! ☕🌿",
      hashtags: ["#चायकीचुस्की", "#सुकून", "#सुबहकीचाय", "#Zindagi", "#ChaiTime"],
      imageQuery: "clay kulhad tea spices morning sunlight"
    }
  ],
  en: [
    {
      caption: "Every sunrise is an invitation to brighten someone's day and rewrite your story. Keep the passion alive, stay hungry, and trust the journey! 🌅✨",
      hashtags: ["#RiseAndGrind", "#MorningMotivation", "#MindsetMatters", "#Growth", "#DailyInspiration"],
      imageQuery: "golden sunrise mountain horizon cinematic peaceful"
    },
    {
      caption: "A warm cup of comfort, raindrops tapping on the glass, and thoughts that drift far away. The art of slowing down in a fast-moving world. ☕🌧️",
      hashtags: ["#CozyVibes", "#RainyDays", "#ChaiMoments", "#PauseAndReflect", "#SlowLiving"],
      imageQuery: "cozy mug hot beverage window rain aesthetic moody"
    },
    {
      caption: "Building things that matter. In an era of rapid disruption, focus and curiosity are the ultimate superpowers! 🚀💻",
      hashtags: ["#TechInnovator", "#BuildInPublic", "#FutureForward", "#Creativity", "#DeepWork"],
      imageQuery: "minimalist laptop creative design tech workspace neon ambient"
    }
  ]
};

const LANGUAGES = [
  { code: "mr", name: "मराठी", subtext: "Marathi", flag: "🚩", badgeColor: "from-orange-500 to-amber-600" },
  { code: "hi", name: "हिंदी", subtext: "Hindi", flag: "🪷", badgeColor: "from-rose-500 to-orange-500" },
  { code: "en", name: "English", subtext: "Global", flag: "🌐", badgeColor: "from-blue-600 to-cyan-500" }
];

const TONES = [
  { id: "inspiring", label: "Inspiring", icon: "✨" },
  { id: "casual", label: "Casual & Fun", icon: "😎" },
  { id: "poetic", label: "Poetic / हळवा", icon: "🍂" },
  { id: "business", label: "Professional", icon: "💼" }
];

export default function App() {
  const [language, setLanguage] = useState("mr");
  const [topic, setTopic] = useState("");
  const [selectedTone, setSelectedTone] = useState("inspiring");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isDeviceFrame, setIsDeviceFrame] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [liked, setLiked] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  const speechSynthRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Preload an initial welcome caption
  useEffect(() => {
    handleApplyPreset(PRESETS[0], "mr");
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2800);
  };

  const handleApplyPreset = (preset, langToUse = language) => {
    const topicText = preset.topic[langToUse] || preset.topic["en"];
    setTopic(topicText);
    
    // Set matching thematic image
    const themedKeyword = encodeURIComponent(`${preset.imageTheme} photography high quality`);
    setImageUrl(`https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80`);
    
    // Pick local authentic preview immediately
    const sampleList = OFFLINE_TEMPLATES[langToUse] || OFFLINE_TEMPLATES["en"];
    const chosen = sampleList[Math.floor(Math.random() * sampleList.length)];
    setCaption(chosen.caption);
    setHashtags(chosen.hashtags);
    setLiked(false);
  };

  const generateMultilingualContent = async () => {
    if (!topic.trim()) {
      showToast("Please enter a topic first! / कृपया विषय लिहा!");
      return;
    }

    setIsGenerating(true);
    setImageLoading(true);
    setCopied(false);
    setLiked(false);

    const langObj = LANGUAGES.find((l) => l.code === language);
    const langName = langObj ? langObj.name : "English";

    const systemPrompt = `You are a world-class social media copywriter specialized in authentic Indian languages (Marathi, Hindi, English).
Your job is to generate a catchy, culturally tuned, high-engagement caption based on the user's topic and tone.
RULES:
1. If language is 'mr' (मराठी), output natural, culturally rich, authentic Marathi with proper grammar and native phrasing.
2. If language is 'hi' (हिंदी), output natural, engaging Hindi with warmth and depth.
3. If language is 'en' (English), output crisp, evocative English.
4. Tone: ${selectedTone}.
5. Return ONLY a valid JSON object matching the requested schema with:
   - "caption": text of the caption with appropriate emojis.
   - "hashtags": array of 4-6 relevant hashtags (mix of language and trending tags).
   - "visualSearchQuery": 3 to 5 English keywords to search for a stunning visual wallpaper/photograph representing this topic.`;

    const userPrompt = `Topic: "${topic}"\nTarget Language: ${langName} (${language})\nTone: ${selectedTone}`;

    try {
      const apiKey = ""; // Handled automatically by Canvas runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              caption: { type: "STRING" },
              hashtags: {
                type: "ARRAY",
                items: { type: "STRING" }
              },
              visualSearchQuery: { type: "STRING" }
            },
            required: ["caption", "hashtags", "visualSearchQuery"]
          }
        }
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (rawText) {
        const parsed = JSON.parse(rawText);
        setCaption(parsed.caption || "");
        setHashtags(parsed.hashtags || []);
        
        // Fetch matching image based on Gemini's visual suggestion
        const cleanQuery = encodeURIComponent(parsed.visualSearchQuery || topic);
        const dynamicImg = `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80&sig=${Math.floor(Math.random() * 1000)}`;
        setImageUrl(`https://source.unsplash.com/800x800/?${cleanQuery}` || dynamicImg);
        showToast("Caption & Visual generated! 🎉");
      } else {
        throw new Error("Empty candidate received");
      }
    } catch (err) {
      console.warn("Using offline smart generation:", err);
      // Seamless offline fallback
      const pool = OFFLINE_TEMPLATES[language] || OFFLINE_TEMPLATES["en"];
      const fallbackItem = pool[Math.floor(Math.random() * pool.length)];
      
      setCaption(
        `${fallbackItem.caption}\n\n[विषय: ${topic.slice(0, 40)}]`
      );
      setHashtags(fallbackItem.hashtags);
      setImageUrl(`https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80&sig=${Date.now()}`);
      showToast("Generated with smart presets! ✨");
    } finally {
      setIsGenerating(false);
      setImageLoading(false);
    }
  };

  const handleCopy = () => {
    const fullContent = `${caption}\n\n${hashtags.join(" ")}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullContent).then(() => {
        setCopied(true);
        showToast("Copied to clipboard! 📋");
        setTimeout(() => setCopied(false), 2200);
      });
    } else {
      const el = document.createElement("textarea");
      el.value = fullContent;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      showToast("Copied! 📋");
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleSpeak = () => {
    if (!window.speechSynthesis) {
      showToast("Text-to-speech not supported in browser");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = caption.replace(/[\u{1F600}-\u{1F6FF}]/gu, "");
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Choose appropriate voice/locale
    if (language === "mr") utterance.lang = "mr-IN";
    else if (language === "hi") utterance.lang = "hi-IN";
    else utterance.lang = "en-US";

    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col items-center justify-start sm:py-6 p-2 sm:px-4 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Floating Controls Bar */}
      <header className="w-full max-w-md flex items-center justify-between mb-3 px-3 py-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white leading-tight">
              CaptionCraft <span className="text-amber-400">वाणी</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Marathi • Hindi • English Studio</p>
          </div>
        </div>

        {/* Device Frame View Switcher */}
        <button
          onClick={() => setIsDeviceFrame(!isDeviceFrame)}
          className="text-xs flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-slate-200 border border-white/10"
          title="Toggle Mobile Bezel Shell"
        >
          {isDeviceFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          <span className="hidden xs:inline">{isDeviceFrame ? "Full Screen" : "Phone Frame"}</span>
        </button>
      </header>

      {/* Main Smartphone Shell Container */}
      <main
        className={`w-full transition-all duration-300 ${
          isDeviceFrame
            ? "max-w-[420px] rounded-[44px] border-[8px] border-slate-800/90 shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.15)] bg-slate-900 overflow-hidden relative"
            : "max-w-xl rounded-3xl border border-white/10 shadow-2xl bg-slate-900/90 p-4"
        }`}
      >
        {/* Smartphone Notch & Status Bar (Simulated Modern UI) */}
        {isDeviceFrame && (
          <div className="pt-2 px-6 pb-2 flex items-center justify-between text-[11px] font-semibold text-slate-300 border-b border-white/5 bg-slate-900 select-none">
            <span>{currentTime || "09:41"}</span>

            {/* Dynamic Island Pill */}
            <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center gap-2 px-2 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[8px] font-mono text-slate-400">AI LIVE</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-[9px] font-bold text-emerald-400">5G</span>
              <div className="w-4 h-2.5 border border-slate-400 rounded-sm p-0.5 flex items-center">
                <div className="h-full w-3/4 bg-slate-200 rounded-xs"></div>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Mobile App Body */}
        <div className="p-4 sm:p-5 max-h-[82vh] overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10">
          
          {}
          <section className="bg-slate-800/60 rounded-2xl p-3 border border-white/10 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                Select Language / भाषा निवडा
              </label>
              <span className="text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                {language.toUpperCase()}
              </span>
            </div>

            {/* Multilingual segmented select tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-white/5">
              {LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      showToast(`Language switched to ${lang.name}`);
                    }}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all text-center relative overflow-hidden ${
                      isSelected
                        ? "bg-gradient-to-b from-indigo-600 to-indigo-700 text-white font-bold shadow-md shadow-indigo-600/30 ring-1 ring-white/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-sm">{lang.flag}</span>
                      <span className="text-xs font-semibold">{lang.name}</span>
                    </div>
                    <span className="text-[9px] opacity-75">{lang.subtext}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {}
          <section className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" /> Quick 1-Tap Presets / लोकप्रिय विषय:
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-white/10 hover:border-amber-400/40 text-[11px] text-slate-300 hover:text-white transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                >
                  <span>{preset.icon}</span>
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </section>

          {}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="topic-input" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-amber-400" />
                Topic or Prompt / पोस्टचा विषय:
              </label>
              <span className="text-[10px] text-slate-400">
                {topic.length} / 160
              </span>
            </div>

            <div className="relative">
              <input
                id="topic-input"
                type="text"
                maxLength={160}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={
                  language === "mr"
                    ? "उदा. सह्याद्री ट्रेक, पावसाळा, चहा, गणपती बाप्पा..."
                    : language === "hi"
                    ? "उदा. सुबह की चाय, जिम वर्कआउट, सफलता का सफर..."
                    : "e.g., Sunset chai in Sahyadris, startup journey, fitness..."
                }
                className="w-full bg-slate-800/90 border border-white/10 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
              />
              {topic && (
                <button
                  onClick={() => setTopic("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs bg-slate-700/60 w-5 h-5 rounded-full flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Tone Selector */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">Mood:</span>
              {TONES.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all whitespace-nowrap flex items-center gap-1 ${
                    selectedTone === tone.id
                      ? "bg-amber-500/20 border-amber-400 text-amber-300 font-semibold"
                      : "bg-slate-800/40 border-white/5 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span>{tone.icon}</span>
                  <span>{tone.label}</span>
                </button>
              ))}
            </div>
          </section>

          {}
          <button
            type="button"
            onClick={generateMultilingualContent}
            disabled={isGenerating}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-95 ${
              isGenerating
                ? "bg-indigo-700/60 cursor-not-allowed text-indigo-200"
                : "bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-rose-500/25 hover:shadow-indigo-500/30 hover:shadow-xl"
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                <span>Generating {LANGUAGES.find((l) => l.code === language)?.name} Visual & Caption...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-amber-200" />
                <span>Generate Caption & Match Visual / बनवा</span>
              </>
            )}
          </button>

          {}
          <section className="bg-slate-800/60 rounded-2xl p-3 border border-white/10 space-y-2 relative group overflow-hidden">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                Thematic Visual Card
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Instant Match
              </span>
            </div>

            {/* Visual Container */}
            <div className="w-full aspect-video sm:aspect-square max-h-56 rounded-xl bg-slate-950 border border-white/5 overflow-hidden relative flex items-center justify-center shadow-inner">
              {imageLoading ? (
                <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin"></div>
                  <p className="text-[11px] text-slate-400">Fetching high-res visual for "{topic.slice(0, 25)}"...</p>
                </div>
              ) : imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt={topic || "Topic Visual"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  {/* Image Overlay Badge */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                    <span className="bg-black/60 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded-md font-medium border border-white/10">
                      {LANGUAGES.find((l) => l.code === language)?.flag} {LANGUAGES.find((l) => l.code === language)?.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLiked(!liked);
                        showToast(liked ? "Removed from favorites" : "Added to favorites! ❤️");
                      }}
                      className="pointer-events-auto w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform"
                    >
                      <Heart className={`w-3.5 h-3.5 ${liked ? "fill-rose-500 text-rose-500" : "text-white"}`} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-4 text-slate-500 text-xs">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-40" />
                  Click Generate to view visual
                </div>
              )}
            </div>
          </section>

          {}
          <section className="bg-slate-800/60 rounded-2xl p-3 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <label htmlFor="caption-output" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Generated Caption / कॅप्शन:
              </label>

              <div className="flex items-center gap-1">
                {/* Audio Listen Button */}
                <button
                  onClick={handleSpeak}
                  disabled={!caption}
                  title="Read Caption Aloud"
                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
                    isSpeaking
                      ? "bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse"
                      : "bg-slate-700/50 border-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                {/* Copy to Clipboard Button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!caption}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    copied
                      ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm shadow-emerald-500/20"
                      : "bg-indigo-600 hover:bg-indigo-500 border-indigo-400/30 text-white active:scale-95"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Editable Caption Box */}
            <div className="relative">
              <textarea
                id="caption-output"
                rows={4}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Your generated caption in Marathi, Hindi, or English will appear here..."
                className="w-full bg-slate-900/90 border border-white/10 focus:border-indigo-400 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-400 leading-relaxed resize-none shadow-inner"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 mt-1">
                <span>Characters: {caption.length}</span>
                <span className="italic">Editable • संपादनक्षम</span>
              </div>
            </div>

            {/* Hashtag Badges Container */}
            {hashtags.length > 0 && (
              <div className="pt-1 border-t border-white/5">
                <span className="text-[10px] font-medium text-slate-400 block mb-1">Recommended Hashtags:</span>
                <div className="flex flex-wrap gap-1.5">
                  {hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      onClick={() => {
                        if (!caption.includes(tag)) {
                          setCaption((prev) => `${prev} ${tag}`);
                          showToast(`Appended ${tag}`);
                        }
                      }}
                      className="cursor-pointer text-[10px] bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md transition-colors"
                      title="Click to add to caption"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {}
          <footer className="text-center pt-2 pb-1 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <Info className="w-3 h-3 text-indigo-400" />
            <span>Select Marathi, Hindi, or English & tap any preset for instant captions!</span>
          </footer>

        </div>

        {/* Smartphone Home Indicator Bar */}
        {isDeviceFrame && (
          <div className="py-2 flex items-center justify-center bg-slate-900">
            <div className="w-28 h-1 bg-slate-600 rounded-full"></div>
          </div>
        )}
      </main>

      {}
      {toastMessage && (
        <div className="fixed bottom-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-white text-xs font-semibold rounded-full shadow-2xl border border-white/20 animate-fade-in backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
