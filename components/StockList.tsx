import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { getData } from '../webScraper/utility/storageUtil';
import StockCard from './StockCard';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const StockList: React.FC = () => {
    const [stocks, setStocks] = useState<any[]>([]);
    const navigation = useNavigation<any>();

    // ✅ Load stocks whenever the screen is focused
    useFocusEffect(
        useCallback(() => {
            loadStocks();
        }, [])
    );


    const loadStocks = async () => {
        const data = await getData();
        setStocks(data || []);
        // console.log(JSON.stringify(data, null, 2));
    };

    if (stocks.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No stocks saved yet. Go to Settings and fetch data.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={stocks}
                renderItem={({ item }) => (
                    <StockCard stock={item} onPress={() => navigation.navigate('StockDetails', { stock: item })} />
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#4f96c9b0', padding: 10 },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyText: { color: '#666', fontSize: 16, textAlign: 'center', padding: 20 },
});

export default StockList;
