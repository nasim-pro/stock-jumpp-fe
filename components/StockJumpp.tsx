import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { mainDriver } from '../webScraper/main-driver';
import { getData } from '../webScraper/utility/storageUtil';

const StockJumpp: React.FC = () => {
  const [stockData, setStockData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStoredData = async () => {
      const data = await getData();
      console.log('Fetched stored data:', data);
      setStockData(data || []);
    };
    fetchStoredData();
  }, []);

  const handlePress = async () => {
    console.log('Running main driver...');
    await mainDriver();

    const updatedData = await getData();
    setStockData(updatedData || []);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📈 Stock Analysis Dashboard</Text>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {stockData.length === 0 ? (
          <Text style={styles.emptyText}>No data available</Text>
        ) : (
          stockData.map((item, index) => {
            const rec = item.recomendation || {};
            return (
              <View key={index} style={styles.stockCard}>
                <Text style={styles.stockName}>{item.stockName}</Text>

                <View style={styles.row}>
                  <Text style={styles.label}>Price:</Text>
                  <Text style={styles.value}>₹{item.currentPrice ?? 'N/A'}</Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Market Cap:</Text>
                  <Text style={styles.value}>{item.marketCap ?? 'N/A'} Cr</Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Debt:</Text>
                  <Text style={styles.value}>{item.debt ?? 'N/A'} Cr</Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Promoter Holding:</Text>
                  <Text style={styles.value}>{item.promoterHolding ?? 'N/A'}%</Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>PE Ratio:</Text>
                  <Text style={styles.value}>{item.peRatio ?? 'N/A'}</Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>DPS Score:</Text>
                  <Text
                    style={[
                      styles.value,
                      { color: item.DPS > 50 ? 'green' : item.DPS > 20 ? '#F5A623' : 'red' },
                    ]}
                  >
                    {item.DPS ?? 'N/A'}
                  </Text>
                </View>

                <View style={[styles.row, { marginTop: 6 }]}>
                  <Text style={styles.label}>Decision:</Text>
                  <Text
                    style={[
                      styles.value,
                      { color: rec.decision === 'BUY' ? 'green' : 'red' },
                    ]}
                  >
                    {rec.decision ?? 'N/A'}
                  </Text>
                </View>

                {/* Growth details */}
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Growth Comparison</Text>
                </View>

                {['EPS', 'Sales', 'OP', 'PAT'].map((key) => {
                  const metric = rec[key] || {};
                  return (
                    <View key={key} style={styles.metricRow}>
                      <Text style={styles.metricLabel}>{key}:</Text>
                      <Text style={styles.metricValue}>
                        Old: {metric.oldGrowthRate ?? '—'}%
                      </Text>
                      <Text style={styles.metricValue}>
                        New: {metric.newGrowthRate ?? '—'}%
                      </Text>
                      <Text
                        style={[
                          styles.metricValue,
                          {
                            color:
                              metric.jumpPercent > 0
                                ? 'green'
                                : metric.jumpPercent < 0
                                  ? 'red'
                                  : '#333',
                          },
                        ]}
                      >
                        Jump: {metric.jumpPercent ?? '—'}%
                      </Text>
                    </View>
                  );
                })}
              </View>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Fetch Latest Data</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F0F2',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    marginTop: 40,
  },
  stockCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  stockName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  label: {
    fontSize: 15,
    color: '#555',
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111',
  },
  sectionHeader: {
    marginTop: 10,
    borderTopColor: '#EEE',
    borderTopWidth: 1,
    paddingTop: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  metricLabel: {
    fontWeight: '500',
    color: '#555',
    width: 50,
  },
  metricValue: {
    fontSize: 13,
    color: '#333',
    width: 85,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 14,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StockJumpp;
