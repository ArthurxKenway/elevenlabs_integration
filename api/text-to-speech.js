const { ElevenLabsClient } = require("@elevenlabs/elevenlabs-js");

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Handle POST request
  if (req.method === "POST") {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: "Text is required" });

      const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
      const audio = await client.textToSpeech.convert("EXAVITQu4vr4xnSDxMaL", {
        text: text.slice(0, 1000), // Limit to 1000 chars for free plan
        modelId: "eleven_multilingual_v2"
      });

      res.setHeader("Content-Type", "audio/mpeg");
      audio.pipe(res);
    } catch (error) {
      console.error("Error generating audio:", error.message);
      res.status(500).json({ error: "Failed to generate audio", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
