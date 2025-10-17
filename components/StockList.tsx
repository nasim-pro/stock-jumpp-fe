import React, { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { addToWatchlist, getData } from '../webScraper/utility/storageUtil';
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

    const handleLongPress = (stock: any) => {
        // Show contextual menu options (delete, edit)
        Alert.alert(
            'Add to watch list?',
            undefined,
            [
                // { text: 'Edit', onPress: () => editTask(task) },
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Add', onPress: async () => {
                        await addToWatchlist(stock);
                        Alert.alert('✅ Added', `${stock?.stockName || "Stock"} has been added to your watchlist.`);
                    }
                },
            ],
            {
                cancelable: true,
                // containerStyle: { justifyContent: 'center' },
            },
        );
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
                    <StockCard 
                    stock={item} 
                    onLongPress={() => handleLongPress(item)} 
                    onPress={() => navigation.navigate('StockDetails', { stock: item })} />
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#9DB2BF', padding: 10 },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyText: { color: '#666', fontSize: 16, textAlign: 'center', padding: 20 },
});

export default StockList;
