import { sendTeleGramMessage } from "./sendTelegramMessage";

interface StockData {
    symbol?: string;
    company?: string;
}

/**
 * Sends a formatted Telegram message listing all companies whose results were released.
 * @param data - Array of stock/company data objects
 */
export async function sendResultMessage(data: StockData[]): Promise<void | null> {
    try {
        if (!Array.isArray(data) || data.length === 0) return null;

        const symbols = data.map(item => item?.symbol || item?.company).filter(Boolean) as string[];

        if (symbols.length === 0) return null;

        const message = `Results have been released today for: ${symbols.join(", ")}`;
        await sendTeleGramMessage(message);
    } catch (err) {
        console.error("Error sending result message:", err);
        return null;
    }
}
