import axios from "axios";
import dayjs from "dayjs";
import { API_BASE } from "../../config";

export interface Filing {
    creation_Date: string;
    [key: string]: any;
}

interface LastProcessedResponse {
    lastProcessedTime: string | null;
}

/**
 * Manually parses a "DD-Mon-YYYY HH:MM:SS" string, interprets the time as IST (UTC+5:30), 
 * and constructs a reliable JavaScript Date object.
 * * @param customDateString The date string, e.g., "06-Oct-2025 20:25:49".
 * @returns A JavaScript Date object (internal time is UTC).
 */
function parseDate(customDateString: string): Date {
    const IST_OFFSET_MINUTES = 330; // 5 hours 30 minutes

    const monthMap: Record<string, number> = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };

    const regex = /(\d{2})-(\w{3})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/;
    const parts = customDateString.match(regex);

    if (!parts) {
        // Return Invalid Date object if format is mismatched
        return new Date();
    }

    const day = parseInt(parts[1], 10);
    const monthIndex = monthMap[parts[2]];
    const year = parseInt(parts[3], 10);
    const hour = parseInt(parts[4], 10);
    const minute = parseInt(parts[5], 10);
    const second = parseInt(parts[6], 10);

    // 1. Create a UTC timestamp treating the input time components as UTC.
    let utcTimestamp = Date.UTC(year, monthIndex, day, hour, minute, second);

    // 2. Adjust for IST offset (UTC+5:30). IST time - offset = UTC time.
    const correctionMs = IST_OFFSET_MINUTES * 60 * 1000;
    utcTimestamp -= correctionMs;

    return new Date(utcTimestamp);
}


export async function getFreshFilings(filings: Filing[]): Promise<Filing[]> {
    try {
    // Step 1: Get lastProcessedTime (fallback to yesterday)
    let lastProcessedTime = dayjs().subtract(1, "day");
    try {
        const { data } = await axios.get<LastProcessedResponse>(`${API_BASE}/api/last-processed`);
        if (data?.lastProcessedTime && dayjs(parseDate(data.lastProcessedTime)).isValid()) {
            lastProcessedTime = dayjs(parseDate(data.lastProcessedTime));
        }
    } catch (apiErr: any) {
        console.warn("⚠️ Failed to fetch lastProcessedTime, using yesterday:", apiErr.message);
    }

    // Step 2: Filter fresh filings
    const fresh = filings?.filter((filing) => {
        const filingDate = dayjs(parseDate(filing?.creation_Date));
        console.log("filingDate", filingDate, "lastProcessedTime", lastProcessedTime);
        
        if (!filingDate.isValid()) return false;
        return filingDate.isAfter(lastProcessedTime);
    });

    // Step 3: PATCH to update lastProcessedTime (fail silently)
    if (fresh.length > 0) {
        try {
            const maxTime = fresh.reduce((latest, f) => {
                const date = dayjs(parseDate(f.creation_Date));
                return date.isValid() && date.isAfter(latest) ? date : latest;
            }, lastProcessedTime);
            await axios.patch(`${API_BASE}/api/last-processed`, {
                lastProcessedTime: maxTime.toISOString(),
            });

            console.log("✅ Updated lastProcessedTime:", maxTime.toISOString());
        } catch (patchErr: any) {
            console.log("Failed to update last processed time", patchErr.message);
        }
    }

    return fresh;
    } catch (err) {
        console.error("Error in getFreshFilings:", err);
        return []; // On error, return empty array to avoid blocking processing
    }
}
