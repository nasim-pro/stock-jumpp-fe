import { nseDriver } from "./scrape/nse-driver.ts";
import { bseDriver } from "./scrape/bse-driver.ts";
// import mongoose from "mongoose";

export async function mainDriver() {
    try {
        await nseDriver()
    } catch (err: any) {
        console.log(`Error in nse driver ${err}`);
    }

    try {
        await bseDriver()
    } catch (err: any) {
        console.log(`Error in bse driver ${err}`);
    }

    return true;
}


// (async () => {
//     try {
//         // Run main scraping logic
//         await mainDriver();
//     } catch (err) {
//         console.error("Error in main driver:", err);
//     } finally {
//         // Close MongoDB connection at the end
//         if (mongoose.connection.readyState !== 0) {
//             await mongoose.connection.close();
//             console.log("MongoDB connection closed.");
//         }
//         process.exit(0); // exit Node.js
//     }
// })();