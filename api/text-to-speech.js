const { ElevenLabsClient } = require("@elevenlabs/elevenlabs-node");

module.exports = async (req, res) => {
  // Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins (for testing)
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
    const audio = await client.generate({
      text: text.slice(0, 1000), // Limit to 1000 chars
      voice: "EXAVITQu4vr4xnSDxMaL", // Bella voice
      model_id: "eleven_multilingual_v2"
    });

    res.setHeader("Content-Type", "audio/mpeg");
    audio.pipe(res);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate audio" });
  }
};
