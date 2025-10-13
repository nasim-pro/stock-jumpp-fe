//utility/dpsScore.ts
interface Recommendation {
    EPS?: { newGrowthRate?: number, oldGrowthRate?: number, jumpPercent?: number };
    Sales?: { newGrowthRate?: number, oldGrowthRate?: number, jumpPercent?: number };
    PAT?: { newGrowthRate?: number, oldGrowthRate?: number, jumpPercent?: number };
    OP?: { newGrowthRate?: number, oldGrowthRate?: number, jumpPercent?: number };
    PE?: number;
    PEG?: number;
}

interface Company {
    recommendation?: Recommendation;
    roe?: number;
    DPS?: number;
}

/**
 * Balanced DPS (Doubling Potential Score) calculator
 * tuned for realistic stock performance
 */
function calculateDPS(company: Company): number {
    try {
        const r = company.recommendation || {};
        let score = 0;
        let totalWeight = 0;

        const weights = {
            EPS: 0.25,
            Sales: 0.20,
            PAT: 0.20,
            OP: 0.15,
            PE: 0.05,
            PEG: 0.10, // ↑ more emphasis on undervaluation
            ROE: 0.05,
        };

        const growthCap = 70; // ↑ allows stronger growth impact

        if (r.EPS?.newGrowthRate !== undefined) {
            score += Math.min(r.EPS.newGrowthRate, growthCap) * weights.EPS;
            totalWeight += weights.EPS;
        }

        if (r.Sales?.newGrowthRate !== undefined) {
            score += Math.min(r.Sales.newGrowthRate, growthCap) * weights.Sales;
            totalWeight += weights.Sales;
        }

        if (r.PAT?.newGrowthRate !== undefined) {
            score += Math.min(r.PAT.newGrowthRate, growthCap) * weights.PAT;
            totalWeight += weights.PAT;
        }

        if (r.OP?.newGrowthRate !== undefined) {
            score += Math.min(r.OP.newGrowthRate, growthCap) * weights.OP;
            totalWeight += weights.OP;
        }

        if (r.PE !== undefined) {
            // Less harsh PE penalty; good up to PE=40
            const peScore = Math.max(0, 40 - Math.min(r.PE, 40));
            score += (peScore / 40) * 100 * weights.PE;
            totalWeight += weights.PE;
        }

        if (r.PEG !== undefined) {
            const pegScore = Math.max(0, 50 - Math.abs(1 - r.PEG) * 40); // smoother curve
            score += (pegScore / 50) * 100 * weights.PEG;
            totalWeight += weights.PEG;
        }

        if (company.roe !== undefined) {
            const roeScore = Math.min(company.roe, 40);
            score += (roeScore / 40) * 100 * weights.ROE;
            totalWeight += weights.ROE;
        }

        return totalWeight > 0 ? Math.round(score / totalWeight) : 0;
    } catch (err) {
        return 0;
    }
}

/**
 * Mutates the companies array and adds DPS score
 * @param companies - array of company JSON objects
 */
export function addDPSScore(companies: Company[]): void {
    companies.forEach((company) => {
        try {
            company.DPS = calculateDPS(company);
        } catch (err) {
            company.DPS = 0; // fallback if calculation fails
        }
    });
}


// const mangalElectrical: Company = {
//     recommendation: {
//         EPS: { newGrowthRate: 17.11 },
//         Sales: { newGrowthRate: 2.6 },
//         PAT: { newGrowthRate: 19.35 },
//         OP: { newGrowthRate: 17.57 },
//         PE: 26.53,
//         PEG: 0.44,
//     },
//     roe: 34.89,
// };

// const dps = calculateDPS(mangalElectrical);
// console.log("Mangal Electrical Industries DPS:", dps);

