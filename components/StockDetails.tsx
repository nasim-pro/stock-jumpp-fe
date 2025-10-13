


import React from 'react';
import { ScrollView, Text, View, StyleSheet, Dimensions } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

// --- Type Definitions ---
interface GrowthMetric {
    oldGrowthRate?: number | string | null;
    newGrowthRate?: number | string | null;
    jumpPercent?: number | string | null;
    change?: number | string | null;
}

interface StockRecommendation {
    decision?: string;
    PEG?: number | string | null;
    PE?: number | string | null;
    EPS?: GrowthMetric;
    Sales?: GrowthMetric;
    OP?: GrowthMetric;
    PAT?: GrowthMetric;
}

interface StockData {
    stockName: string;
    currentPrice?: number | string | null;
    DPS?: number | string | null;
    marketCap?: number | string | null;
    debt?: number | string | null;
    promoterHolding?: number | string | null;
    peRatio?: number | string | null;
    roe?: number | string | null;
    roce?: number | string | null;
    years: string[];
    yearlySales: (number | string | null)[];
    yearlyPat: (number | string | null)[];
    yearlyEps: (number | string | null)[];
    yearlyOpProfit: (number | string | null)[];
    recomendation?: StockRecommendation;
}

type StockDetailsRouteParams = {
    stock: StockData;
};

// --- Utilities ---
const getDecisionStyle = (decision: string | undefined) => {
    if (!decision) return { color: '#999', text: 'N/A' };
    const d = decision.toLowerCase();
    if (d.includes('buy')) return { color: '#16a34a', text: 'BUY' };
    if (d.includes('sell')) return { color: '#dc2626', text: 'SELL' };
    if (d.includes('hold')) return { color: '#facc15', text: 'HOLD' };
    return { color: '#999', text: 'N/A' };
};

const getJumpColor = (jump: number | string | null | undefined) => {
    if (typeof jump === 'number') return jump >= 0 ? '#16a34a' : '#dc2626';
    return '#333';
};

const getPromoterHoldingColor = (promoterHolding: number | string | null | undefined) => {
    if (promoterHolding === null || promoterHolding === undefined) return '#999';
    const ph = Number(promoterHolding);
    if (isNaN(ph)) return '#999';

    if (ph >= 50 && ph <= 85) return '#16a34a';      // 🟢 Healthy
    if (ph >= 25 && ph < 50) return '#f79800ff';    // 🟡 Moderate
    if (ph < 25) return '#dc2626';                  // 🔴 Low
    if (ph > 75) return '#ddb822ff';                  // 🟠 Very high
    return '#999';
};


const formatValue = (value: number | string | null | undefined, isPercentage: boolean = false) => {
    if (value === undefined || value === null) return '—';
    const num = Number(value);
    if (isNaN(num)) return '—';
    if (!isPercentage) return num.toFixed(2);
    return `${num.toFixed(2)}%`;
};

// --- Reusable Components ---
const MetricRow = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
    <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>{label}:</Text>
        <Text style={styles.metricValue}>{value ?? '—'}</Text>
    </View>
);

const getDpsColor = (dps: number | string | null | undefined) => {
    if (dps === null || dps === undefined) return '#999';
    const value = Number(dps);
    if (isNaN(value)) return '#999';
    if (value >= 50) return '#00ff5eff'; // Green
    if (value >= 30) return '#f79800ff'; // Yellow
    return '#f20000ff'; // Red
};


// --- Main Component ---
const StockDetails = () => {
    const route = useRoute<RouteProp<{ params: StockDetailsRouteParams }, 'params'>>();
    const { stock: rawStock } = route.params;

    const stock: StockData = rawStock || ({} as StockData);
    const { recomendation } = stock;
    const { color: decisionColor, text: decisionText } = getDecisionStyle(recomendation?.decision);

    const growthMetrics = [
        { key: 'EPS', label: 'EPS', data: recomendation?.EPS },
        { key: 'Sales', label: 'Sales', data: recomendation?.Sales },
        { key: 'OP', label: 'OP', data: recomendation?.OP },
        { key: 'PAT', label: 'PAT', data: recomendation?.PAT },
    ];

    const yearlyMetrics = [
        { label: 'Sales', data: stock.yearlySales },
        { label: 'PAT', data: stock.yearlyPat },
        { label: 'EPS', data: stock.yearlyEps },
        { label: 'OP', data: stock.yearlyOpProfit },
    ];

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.stockName}>{stock.stockName}</Text>
            </View>

            {/* Main Metrics Card */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Fundamentals</Text>
                <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>DPS Score:</Text>
                    <Text style={[styles.metricValue, { fontWeight: '700', color: getDpsColor(stock.DPS) }]}>{stock.DPS ?? '—'}</Text>
                </View>
                <MetricRow label="Price" value={stock.currentPrice ?? '—'} />
                <MetricRow label="Market Cap" value={stock.marketCap ?? '—'} />
                <MetricRow label="Debt" value={stock.debt ?? '—'} />
                {/* <MetricRow label="Promoter Holding" value={`${stock.promoterHolding ?? 'NA'}`} /> */}
                <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Promoter Holding:</Text>
                    <Text style={[styles.metricValue, {fontWeight: '700', color: getPromoterHoldingColor(stock.promoterHolding)}]}> {stock.promoterHolding ?? '—'} %</Text>
                </View>
                <MetricRow label="PE Ratio" value={stock.peRatio ?? '—'} />
                <MetricRow label="PEG" value={stock.recomendation?.PEG ?? '—'} />
                <MetricRow label="ROE" value={stock.roe ?? '—'} />
                <MetricRow label="ROCE" value={stock.roce ?? '—'} />
                <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Decision:</Text>
                    <Text style={[styles.metricValue, { fontWeight: '700', color: decisionColor }]}>{decisionText}</Text>
                </View>
            </View>

            {/* Growth Metrics */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Growth Comparison</Text>
                <View style={[styles.growthRow, styles.growthHeaderRow]}>
                    <Text style={[styles.growthCell, styles.labelCell]}></Text>
                    <Text style={styles.growthCell}>Old</Text>
                    <Text style={styles.growthCell}>New</Text>
                    <Text style={[styles.growthCell, { textAlign: 'right' }]}>Jump</Text>
                </View>
                {growthMetrics.map((item) => (
                    <View key={item.key} style={styles.growthRow}>
                        <Text style={[styles.growthCell, styles.labelCell]}>{item.label}:</Text>
                        <Text style={styles.growthCell}>{formatValue(item.data?.oldGrowthRate, true)}</Text>
                        <Text style={styles.growthCell}>{formatValue(item.data?.newGrowthRate, true)}</Text>
                        <Text style={[styles.growthCell, styles.jumpCell, { color: getJumpColor(item.data?.jumpPercent) }]}>
                            {item.data?.jumpPercent !== null && item.data?.jumpPercent !== undefined
                                ? formatValue(item.data.jumpPercent, true)
                                : '—'}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Yearly Trend */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Annual Trend Data</Text>

                {/* Table Header: Years */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View>
                        {/* First Row: Years */}
                        <View style={styles.yearlyTableRow}>
                            <View style={styles.yearlyItemContainer}>
                                <Text style={[styles.yearlyItemHeader, { fontWeight: '700' }]}>Year</Text>
                            </View>
                            {stock.years.map((year, i) => (
                                <View key={i} style={styles.yearlyItemContainer}>
                                    <Text style={styles.yearlyItemHeader}>{year.split(' ')[1]}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Second+ Rows: Metrics */}
                        {yearlyMetrics.map((metric) => (
                            <View key={metric.label} style={styles.yearlyTableRow}>
                                <View style={styles.yearlyItemContainer}>
                                    <Text style={[styles.yearlyItemHeader, { fontWeight: '700' }]}>{metric.label}</Text>
                                </View>
                                {stock.years.map((_, i) => (
                                    <View key={i} style={styles.yearlyItemContainer}>
                                        <Text style={styles.yearlyItemValue}>
                                            {metric.data?.[i] !== null && metric.data?.[i] !== undefined
                                                ? metric.data[i]
                                                : '—'}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f29bec' },
    header: { backgroundColor: '#f29bec', padding: 15, alignItems: 'center', marginBottom: 10, },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
    card: {
        backgroundColor: '#f29bec',
        marginHorizontal: 15,
        marginVertical: 8,
        borderRadius: 12,
        padding: 18,
        // elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    stockName: {
        fontSize: 20,
        fontWeight: '800',
        color: '#333',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: '#000000ff', marginBottom: 10 },
    metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5, borderBottomWidth: 0.5, borderBottomColor: '#f5f5f5' },
    metricLabel: { fontSize: 15, color: '#555', fontWeight: '500' },
    metricValue: { fontSize: 16, color: '#333', fontWeight: '600' },
    growthHeaderRow: { paddingVertical: 8, borderTopLeftRadius: 6, borderTopRightRadius: 6, marginBottom: 5, paddingHorizontal: 5 },
    growthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
    growthCell: { flex: 1, fontSize: 14, color: '#333', textAlign: 'center', fontWeight: '500' },
    labelCell: { flex: 1.5, textAlign: 'left', fontWeight: '600', color: '#222' },
    jumpCell: { fontWeight: '700', textAlign: 'right' },
    yearlyArrayContainer: { marginBottom: 15, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
    yearlyLabel: { fontSize: 15, fontWeight: '600', color: '#444', marginBottom: 5 },
    // yearlyItemContainer: { width: 60, paddingVertical: 4, alignItems: 'center', justifyContent: 'center' },
    // yearlyItemHeader: { fontSize: 14, fontWeight: '600', color: '#555', textAlign: 'center' },
    // yearlyItemValue: { fontSize: 14, color: '#333', textAlign: 'center' },

    //
    yearlyTableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },
    yearlyItemContainer: {
        width: 70, // adjust as needed for screen width
        paddingHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    yearlyItemHeader: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
    },
    yearlyItemValue: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
    },

});

export default StockDetails;
