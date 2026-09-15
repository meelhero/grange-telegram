export default async function handler(req, res) {
  console.log("=== TELEGRAM FUNCTION START ===");
  console.log("METHOD:", req.method);

  try {
    console.log("BODY:", req.body);

    if (req.method !== "POST") {
      console.log("WRONG METHOD");

      return res.status(405).json({
        ok: false,
        error: "Method not allowed"
      });
    }

    const body = req.body || {};

    const text = body.text;

    console.log("TEXT EXISTS:", !!text);
    console.log(
      "TOKEN EXISTS:",
      !!process.env.TELEGRAM_BOT_TOKEN
    );
    console.log(
      "CHAT ID EXISTS:",
      !!process.env.TELEGRAM_CHAT_ID
    );

    if (!text) {
      return res.status(400).json({
        ok: false,
        error: "text is required"
      });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token) {
      return res.status(500).json({
        ok: false,
        error: "TELEGRAM_BOT_TOKEN is missing"
      });
    }

    if (!chatId) {
      return res.status(500).json({
        ok: false,
        error: "TELEGRAM_CHAT_ID is missing"
      });
    }

    console.log("CALLING TELEGRAM...");

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

    console.log(
      "TELEGRAM STATUS:",
      response.status
    );

    const result = await response.json();

    console.log(
      "TELEGRAM RESULT:",
      JSON.stringify(result)
    );

    if (!response.ok || !result.ok) {
      return res.status(502).json({
        ok: false,
        error: "Telegram API error",
        telegram: result
      });
    }

    console.log("=== TELEGRAM SUCCESS ===");

    return res.status(200).json({
      ok: true
    });

  } catch (error) {

    console.error(
      "=== FUNCTION ERROR ==="
    );

    console.error(
      error
    );

    return res.status(500).json({
      ok: false,
      error: String(error)
    });
  }
}
