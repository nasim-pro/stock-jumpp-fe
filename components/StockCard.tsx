
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const StockCard = ({ stock, onPress }: { stock: any; onPress: () => void }) => {
    const dpsColor =
        stock.DPS > 50 ? '#00ff6aff' : stock.DPS > 30 ? '#ff9e02ff' : '#fb1900ff';
    const decisionColor =
        stock.recomendation?.decision === 'BUY'
            ? '#00ff6aff'
            : stock.recomendation?.decision === 'HOLD'
                ? '#ff9d00ff'
                : '#f81900ff';

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            {/* Header Row */}
            <View style={styles.headerRow}>
                <Text style={styles.stockName} numberOfLines={1}>
                    {stock.stockName || 'Unnamed Stock'}
                </Text>
                <Text style={[styles.dps, { color: dpsColor }]}>
                    DPS: {stock.DPS ?? 'N/A'}
                </Text>
            </View>
           
            {/* Key Metrics */}
            <View style={styles.metricsContainer}>
                <View style={styles.metricBox}>
                    <Text style={styles.metricLabel}>P/E</Text>
                    <Text style={styles.metricValue}>{stock.peRatio ?? '—'}</Text>
                </View>

                <View style={styles.metricBox}>
                    <Text style={styles.metricLabel}>Decision</Text>
                    <Text style={[styles.metricValue, { color: decisionColor }]}>
                        {stock.recomendation?.decision ?? 'N/A'}
                    </Text>
                </View>

                <View style={styles.metricBox}>
                    <Text style={styles.metricLabel}>Market Cap</Text>
                    <Text style={styles.metricValue}>
                        {stock.marketCap ? `${stock.marketCap} Cr` : '—'}
                    </Text>
                </View>

                <View style={styles.metricBox}>
                    <Text style={styles.metricLabel}>ROE</Text>
                    <Text style={styles.metricValue}>
                        {stock.roe ? `${stock.roe}%` : '—'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#4f96c9b0',
        padding: 16,
        marginBottom: 12,
        borderRadius: 14,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    stockName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#000',
        flex: 1,
        marginRight: 10,
    },
    dps: {
        fontSize: 15,
        fontWeight: '600',
    },
    metricsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metricBox: {
        alignItems: 'center',
        flex: 1,
    },
    metricLabel: {
        fontSize: 13,
        color: '#000',
        marginBottom: 3,
    },
    metricValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
    },
});

export default StockCard;
