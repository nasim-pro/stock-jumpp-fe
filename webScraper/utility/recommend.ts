
// /**
//  * Flexible CAGR calculation that handles negative → positive transitions
//  * @param {number} begin - Starting value
//  * @param {number} final - Ending value
//  * @param {number} years - Number of years
//  * @returns {number} CAGR as decimal (%) (e.g. 25 = 25%)
//  */
// function CAGR_flexible(begin, final, years) {
//     try {
//         if (years <= 0) return NaN;
//         let cagr = 0;
//         if (begin > 0 && final > 0) {
//             cagr = Math.pow(final / begin, 1 / years) - 1;
//         } else if (begin < 0 && final < 0) {
//             cagr = Math.pow(Math.abs(final) / Math.abs(begin), 1 / years) - 1;
//             cagr *= -1; // stays negative because both are losses
//         } else if (begin < 0 && final > 0) {
//             cagr = Math.pow((final + 2 * Math.abs(begin)) / Math.abs(begin), 1 / years) - 1;
//         } else if (begin > 0 && final < 0) {
//             cagr = -1 * (Math.pow((Math.abs(final) + 2 * begin) / begin, 1 / years) - 1);
//         }
//         return cagr * 100;
//     } catch (err) {
//         console.log("Error calculating cagr", err);
//     }
// }

// /**
//  * Calculate growth change after adding the latest year (using CAGR_flexible)
//  * @param {number[]} yearlyDataArr - EPS values (oldest → latest)
//  * @returns {object}
//  */
// function growthAndJumpCalculator(yearlyDataArr) {
//     try {
//         if (yearlyDataArr.length < 2) {
//             throw new Error("Need at least 2 values (oldest → latest).");
//         }

//         const oldStart = yearlyDataArr[0];
//         const oldEnd = yearlyDataArr[yearlyDataArr.length - 2];
//         const oldYears = yearlyDataArr.length - 2;
//         const oldGrowthRate = CAGR_flexible(oldStart, oldEnd, oldYears);

//         const newStart = yearlyDataArr[0];
//         const newEnd = yearlyDataArr[yearlyDataArr.length - 1];
//         const newYears = yearlyDataArr.length - 1;
//         const newGrowthRate = CAGR_flexible(newStart, newEnd, newYears);

//         const change = parseFloat((newGrowthRate - oldGrowthRate).toFixed(2));
//         const jumpPercent = oldGrowthRate !== 0
//             ? ((newGrowthRate - oldGrowthRate) / Math.abs(oldGrowthRate)) * 100
//             : NaN;

//         return {
//             oldGrowthRate: parseFloat(oldGrowthRate.toFixed(2)),
//             newGrowthRate: parseFloat(newGrowthRate.toFixed(2)),
//             jumpPercent: isNaN(jumpPercent) ? null : parseFloat(jumpPercent.toFixed(2)),
//             change: change,
//             impliedValue: yearlyDataArr[yearlyDataArr.length - 1]
//         };
//     } catch (err) {
//         console.log("Error in growth jump calculator", err);
//     }
// }

// /**
//  * Calculate implied yearly value from quarterly data
//  * Bias added depending on how many quarters are available
//  * (lenient for Q1, strict for Q3/Q4)
//  * @param {number[]} quarterlyArr - values (EPS or Sales, oldest → latest)
//  * @returns {number} implied yearly value (adjusted with bias)
//  */
// function yearlyImpliedGrowth(quarterlyArr) {
//     try {
//         if (quarterlyArr.length === 0) {
//             throw new Error("Need at least 1 quarterly value.");
//         }
//         const sum = quarterlyArr.reduce((a, b) => a + b, 0);
//         const rawImplied = (sum / quarterlyArr.length) * 4;

//         // Quarter bias factors
//         const q = quarterlyArr.length;
//         let factor = 1;
//         if (q === 1) factor = 1.13;  // give extra benefit of doubt in Q1
//         if (q === 2) factor = 1.06;  // slightly lenient in Q2
//         if (q === 3) factor = 1.0;   // no bias in Q3
//         if (q >= 4) factor = 1.0;   // no bias in Q4

//         const impliedValue = rawImplied * factor;

//         return parseFloat(impliedValue.toFixed(2))
//     } catch (err) {
//         console.log("Error in implied growth calculator", err.message);
//         return null
//     }
// }


// /**
//  * Driver function for EPS, Sales, OP, PAT CAGR + PEG + Jump filter
//  * Determines early rerating candidates
//  * @param {number[]} yearlyEPS
//  * @param {number[]} quarterlyEPS
//  * @param {number[]} yearlySales
//  * @param {number[]} quarterlySales
//  * @param {number[]} yearlyOpProfit
//  * @param {number[]} quarterlyOpProfit
//  * @param {number[]} yearlyPat
//  * @param {number[]} quarterlyPat
//  * @param {number} pe - current PE ratio of stock
//  * @param {number} currentPrice - current market price of stock
//  * @returns {object}
//  */
// export function recommend(
//     yearlyEPS,
//     quarterlyEPS,
//     yearlySales,
//     quarterlySales,
//     yearlyOpProfit,
//     quarterlyOpProfit,
//     yearlyPat,
//     quarterlyPat,
//     pe = 30,
//     currentPrice = null
// ) {
//     try {
//         // --- EPS Analysis ---
//         const impliedEPS = yearlyImpliedGrowth(quarterlyEPS);
//         const yearlyEpsCombined = [...yearlyEPS, impliedEPS];
//         const epsResult = growthAndJumpCalculator(yearlyEpsCombined);

//         // --- Sales Analysis ---
//         const impliedSales = yearlyImpliedGrowth(quarterlySales);
//         const yearlySalesCombined = [...yearlySales, impliedSales];
//         const salesResult = growthAndJumpCalculator(yearlySalesCombined);

//         // --- Operating Profit Analysis ---
//         const impliedOp = yearlyImpliedGrowth(quarterlyOpProfit);
//         const yearlyOpCombined = [...yearlyOpProfit, impliedOp];
//         const opResult = growthAndJumpCalculator(yearlyOpCombined);

//         // --- PAT Analysis ---
//         const impliedPat = yearlyImpliedGrowth(quarterlyPat);
//         const yearlyPatCombined = [...yearlyPat, impliedPat];
//         const patResult = growthAndJumpCalculator(yearlyPatCombined);

//         // --- Sales vs EPS consistency ---
//         const salesWithinRange = Math.abs(salesResult.newGrowthRate - epsResult.newGrowthRate) <= 70;

//         // --- PEG Ratio ---
//         const peg = pe / Math.max(epsResult.newGrowthRate, 1);

//         // --- PE expansion check ---
//         let peChange = null;
//         if (currentPrice && yearlyEPS.length > 1) {
//             const oldEPS = yearlyEPS[0];
//             if (oldEPS > 0) {
//                 const oldPE = currentPrice / oldEPS;
//                 peChange = ((pe / oldPE) - 1) * 100;
//             }
//         }

//         // --- Decision Logic for Early Rerating ---
//         let decision = "HOLD";
//         let rerating = false;

//         // if (
//         //     // Trigger if any of OP, EPS, or PAT shows a significant jump
//         //     ((opResult?.jumpPercent ? opResult.jumpPercent >= 30 : false) ||
//         //         (epsResult?.jumpPercent ? epsResult.jumpPercent >= 40 : false) ||
//         //         (patResult?.jumpPercent ? patResult.jumpPercent >= 40 : false)) &&
//         //     // (epsResult?.jumpPercent ? epsResult.jumpPercent > 50 : true) &&            // sudden EPS jump
//         //     // (epsResult?.newGrowthRate ? epsResult.newGrowthRate > 20 : true) &&       // strong EPS CAGR
//         //     (salesResult?.newGrowthRate ? salesResult.newGrowthRate >= 10 : true) &&   // strong Sales growth
//         //     // (opResult?.newGrowthRate ? opResult.newGrowthRate > 5 : true) &&         // operating margin expansion
//         //     (patResult?.newGrowthRate ? patResult.newGrowthRate >= 10 : true) &&      // clean PAT growth
//         //     // (salesWithinRange !== undefined ? salesWithinRange : true) &&            // Sales confirm EPS
//         //     (peg !== undefined ? peg < 5 : true)                                 // not too overvalued
//         //     // (peChange === null || peChange < 60)                                       // PE not already blown up
//         // ) {
//         //     decision = "BUY";
//         //     rerating = true;
//         // }
//         // else if (
//         //     epsResult.newGrowthRate < 15 ||          // weak fundamentals
//         //     peg > 3 ||                               // clearly overvalued
//         //     (peChange !== null && peChange > 100)    // excessive PE expansion
//         // ) {
//         //     decision = "SELL";
//         //     rerating = false;
//         // }

//         if (
//             // EPS jump trigger (quarterly)
//             (epsResult?.jumpPercent ? epsResult.jumpPercent >= 40 : false) &&
//             // EPS CAGR must be strong5
//             (epsResult?.newGrowthRate ? epsResult.newGrowthRate >= 15 : true)
//         ) {
//             decision = "BUY";
//             rerating = true;
//         }
//         else if (
//             epsResult?.newGrowthRate < 10 ||          // weak EPS growth
//             (epsResult?.jumpPercent ? epsResult.jumpPercent < 0 : false) // EPS falling
//         ) {
//             decision = "SELL";
//             rerating = false;
//         }


//         return {
//             EPS: epsResult,
//             Sales: salesResult,
//             OP: opResult,
//             PAT: patResult,
//             PE: pe,
//             PEG: parseFloat(peg.toFixed(2)),
//             peChange: peChange !== null ? parseFloat(peChange.toFixed(2)) : null,
//             decision: decision,
//             reratingCandidate: rerating
//         };
//     } catch (err) {
//         console.log("Error in recommend function", err);
//     }
// }




/**
 * Flexible CAGR calculation that handles negative → positive transitions
 * @param begin - Starting value
 * @param final - Ending value
 * @param years - Number of years
 * @returns CAGR as decimal (%) (e.g. 25 = 25%)
 */
export function CAGR_flexible(begin: number, final: number, years: number): number | undefined {
    try {
        if (years <= 0) return NaN;
        let cagr = 0;

        if (begin > 0 && final > 0) {
            cagr = Math.pow(final / begin, 1 / years) - 1;
        } else if (begin < 0 && final < 0) {
            cagr = Math.pow(Math.abs(final) / Math.abs(begin), 1 / years) - 1;
            cagr *= -1; // stays negative
        } else if (begin < 0 && final > 0) {
            cagr = Math.pow((final + 2 * Math.abs(begin)) / Math.abs(begin), 1 / years) - 1;
        } else if (begin > 0 && final < 0) {
            cagr = -1 * (Math.pow((Math.abs(final) + 2 * begin) / begin, 1 / years) - 1);
        }

        return cagr * 100;
    } catch (err) {
        console.error("Error calculating CAGR", err);
        return undefined;
    }
}

interface GrowthResult {
    oldGrowthRate: number;
    newGrowthRate: number;
    jumpPercent: number | null;
    change: number;
    impliedValue: number | null;
}

/**
 * Calculate growth change after adding latest year (using CAGR_flexible)
 * @param yearlyDataArr - EPS values (oldest → latest)
 * @returns object with growth metrics
 */
export function growthAndJumpCalculator(yearlyDataArr: number[]): GrowthResult | undefined {
    try {
        if (yearlyDataArr.length < 2) {
            throw new Error("Need at least 2 values (oldest → latest).");
        }

        const oldStart = yearlyDataArr[0];
        const oldEnd = yearlyDataArr[yearlyDataArr.length - 2];
        const oldYears = yearlyDataArr.length - 2;
        const oldGrowthRate = CAGR_flexible(oldStart, oldEnd, oldYears) || 0;

        const newStart = yearlyDataArr[0];
        const newEnd = yearlyDataArr[yearlyDataArr.length - 1];
        const newYears = yearlyDataArr.length - 1;
        const newGrowthRate = CAGR_flexible(newStart, newEnd, newYears) || 0;

        const change = parseFloat((newGrowthRate - oldGrowthRate).toFixed(2));
        const jumpPercent = oldGrowthRate !== 0
            ? ((newGrowthRate - oldGrowthRate) / Math.abs(oldGrowthRate)) * 100
            : NaN;

        return {
            oldGrowthRate: parseFloat(oldGrowthRate.toFixed(2)),
            newGrowthRate: parseFloat(newGrowthRate.toFixed(2)),
            jumpPercent: isNaN(jumpPercent) ? null : parseFloat(jumpPercent.toFixed(2)),
            change,
            impliedValue: yearlyDataArr[yearlyDataArr.length - 1]
        };
    } catch (err) {
        console.error("Error in growth jump calculator", err);
        return undefined;
    }
}

/**
 * Calculate implied yearly value from quarterly data
 * @param quarterlyArr - EPS/Sales/Profit values (oldest → latest)
 * @returns implied yearly value
 */
export function yearlyImpliedGrowth(quarterlyArr: number[]): number | null {
    try {
        if (quarterlyArr.length === 0) throw new Error("Need at least 1 quarterly value.");

        const sum = quarterlyArr.reduce((a, b) => a + b, 0);
        const rawImplied = (sum / quarterlyArr.length) * 4;

        let factor = 1;
        switch (quarterlyArr.length) {
            case 1: factor = 1.13; break;
            case 2: factor = 1.06; break;
            case 3: factor = 1.0; break;
            default: factor = 1.0;
        }

        return parseFloat((rawImplied * factor).toFixed(2));
    } catch (err: any) {
        console.error("Error in implied growth calculator", err.message);
        return null;
    }
}

interface RecommendResult {
    EPS: GrowthResult | undefined;
    Sales: GrowthResult | undefined;
    OP: GrowthResult | undefined;
    PAT: GrowthResult | undefined;
    PE: number;
    PEG: number;
    peChange: number | null;
    decision: string;
    reratingCandidate: boolean;
}

/**
 * Driver function for EPS, Sales, OP, PAT CAGR + PEG + Jump filter
 */
export function recommend(
    yearlyEPS: number[],
    quarterlyEPS: number[],
    yearlySales: number[],
    quarterlySales: number[],
    yearlyOpProfit: number[],
    quarterlyOpProfit: number[],
    yearlyPat: number[],
    quarterlyPat: number[],
    pe: number = 30,
    currentPrice: number | null = null
): RecommendResult | undefined {
    try {
        const impliedEPS = yearlyImpliedGrowth(quarterlyEPS);
        const yearlyEpsCombined = [...yearlyEPS, impliedEPS || 0];
        const epsResult = growthAndJumpCalculator(yearlyEpsCombined);

        const impliedSales = yearlyImpliedGrowth(quarterlySales);
        const yearlySalesCombined = [...yearlySales, impliedSales || 0];
        const salesResult = growthAndJumpCalculator(yearlySalesCombined);

        const impliedOp = yearlyImpliedGrowth(quarterlyOpProfit);
        const yearlyOpCombined = [...yearlyOpProfit, impliedOp || 0];
        const opResult = growthAndJumpCalculator(yearlyOpCombined);

        const impliedPat = yearlyImpliedGrowth(quarterlyPat);
        const yearlyPatCombined = [...yearlyPat, impliedPat || 0];
        const patResult = growthAndJumpCalculator(yearlyPatCombined);

        const salesWithinRange = Math.abs((salesResult?.newGrowthRate || 0) - (epsResult?.newGrowthRate || 0)) <= 70;

        const peg = pe / Math.max(epsResult?.newGrowthRate || 1, 1);

        let peChange: number | null = null;
        if (currentPrice && yearlyEPS.length > 1) {
            const oldEPS = yearlyEPS[0];
            if (oldEPS > 0) {
                const oldPE = currentPrice / oldEPS;
                peChange = ((pe / oldPE) - 1) * 100;
            }
        }

        let decision = "HOLD";
        let rerating = false;

        if ((epsResult?.jumpPercent ?? 0) >= 50 && (epsResult?.newGrowthRate ?? 0) >= 15) {
            decision = "BUY";
            rerating = true;
        } else if ((epsResult?.newGrowthRate ?? 0) < 15 || (epsResult?.jumpPercent ?? 0) < 0) {
            decision = "SELL";
            rerating = false;
        }

        return {
            EPS: epsResult,
            Sales: salesResult,
            OP: opResult,
            PAT: patResult,
            PE: pe,
            PEG: parseFloat(peg.toFixed(2)),
            peChange: peChange !== null ? parseFloat(peChange.toFixed(2)) : null,
            decision,
            reratingCandidate: rerating
        };
    } catch (err) {
        console.error("Error in recommend function", err);
        return undefined;
    }
}
