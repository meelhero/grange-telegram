
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { text } = req.body || {};

    if (!text) {
      return res.status(400).json({
        error: "text is required"
      });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return res.status(500).json({
        error: "Telegram environment variables are missing"
      });
    }

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "HTML"
        })
      }
    );

    const result = await response.json();

    console.log("Telegram response:", result);

    if (!response.ok || !result.ok) {
      return res.status(502).json({
        error: "Telegram API error",
        telegram: result
      });
    }

    return res.status(200).json({
      ok: true
    });

  } catch (error) {
    console.error("Telegram error:", error);

    return res.status(500).json({
      error: error.message
    });
  }
}
