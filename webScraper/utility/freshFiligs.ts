// utils/freshFilings.ts
import axios from "axios";
import { API_BASE } from '../../config';


// Type for a single filing
export interface Filing {
    creation_Date: string; // usually an ISO date string
    [key: string]: any;    // allow other properties too
}

// Response from GET /lastProcessed
interface LastProcessedResponse {
    lastProcessedTime: string | null;
}

/**
 * Filters only fresh filings from NSE response data and updates DB state.
 *
 * @param filings - Array of NSE filings objects
 * @returns freshFilings - Only new filings not seen in previous runs
 */
export async function getFreshFilings(filings: Filing[]): Promise<Filing[]> {
    try {
        // Step 1: Call GET API to load previous state
        const { data } = await axios.get<LastProcessedResponse>(
            `${API_BASE}/api/last-processed`
        );

        let lastProcessedTime = data?.lastProcessedTime
            ? new Date(data.lastProcessedTime)
            : null;

        // Step 2: Filter new filings
        const fresh = filings.filter((filing) => {
            const filingDate = new Date(filing.creation_Date);
            if (!lastProcessedTime) return true; // First run → take everything
            return filingDate > lastProcessedTime;
        });

        // Step 3: If there are filings, call PATCH API to update the timestamp
        if (filings.length > 0) {
            const maxTime = new Date(
                Math.max(...filings.map((f) => new Date(f.creation_Date).getTime()))
            );

            await axios.patch(`${API_BASE}/api/last-processed`, {
                lastProcessedTime: maxTime.toISOString(),
            });
        }

        return fresh;
    } catch (err: any) {
        console.error("Error in getFreshFilings (API version):", err.message);
        return [];
    }
}
