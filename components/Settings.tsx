import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { mainDriver } from '../webScraper/main-driver';
// import { storeData } from '../webScraper/utility/storageUtil';

const Settings = () => {
    const [loading, setLoading] = useState(false);

    const handleFetch = async () => {
        try {
            setLoading(true);
            const data = await mainDriver();
            if (data ) {
                Alert.alert('Success', 'Stock data fetched and saved.');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleFetch}>
                    <Text style={styles.buttonText}>Fetch Latest Data</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F9FA' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    button: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default Settings;
