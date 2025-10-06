import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { mainDriver } from '../webScraper/main-driver';
import { getData } from '../webScraper/utility/storageUtil';

const StockJumpp: React.FC = () => {
  const [stockData, setStockData] = useState<any[]>([]);

  // Fetch stored data on mount
  useEffect(() => {
    const fetchStoredData = async () => {
      const data = await getData(); // assuming it returns an array
      setStockData(data);
    };
    fetchStoredData();
  }, []);

  const handlePress = async () => {
    console.log('calling the main driver');
    await mainDriver();

    // Re-fetch data after mainDriver runs
    const updatedData = await getData();
    setStockData(updatedData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to React Native!</Text>

        <ScrollView style={{ maxHeight: 300, width: '100%' }}>
          {stockData.length === 0 ? (
            <Text style={styles.counter}>No data available</Text>
          ) : (
            stockData.map((item, index) => (
              <View key={index} style={styles.stockItem}>
                <Text style={styles.stockText}>
                  KeyStock: {item.keystock} | Value: {JSON.stringify(item)}
                </Text>
              </View>
            ))
          )}
        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Fetch Result</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F0F2',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
    width: '90%',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  counter: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  stockItem: {
    paddingVertical: 6,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  stockText: {
    fontSize: 16,
    color: '#333',
  },
});

export default StockJumpp;
