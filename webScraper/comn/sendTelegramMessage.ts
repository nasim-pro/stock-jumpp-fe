import axios, { AxiosError } from "axios";
import { TELEGRAM_BOT_TOKEN, CHAT_ID } from "../../config";

/**
 * Sends a message to a Telegram chat using the Bot API.
 * @param message - The text message to send.
 */
export async function sendTeleGramMessage(message: string): Promise<void> {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
        const res = await axios.post(url, {
            chat_id: CHAT_ID,
            text: message,
        });

        // Optional logging
        // console.log("✅ Message sent:", res.data);
    } catch (err: unknown) {
        const error = err as AxiosError;
        console.error("Error:", error.response?.data || error.message || "Unknown error"
        );
    }
}
