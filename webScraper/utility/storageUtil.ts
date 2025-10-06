import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'stock';

/**
 * Store array in AsyncStorage
 * @param dataArray Array of any type
 */
export const storeData = async (dataArray: any[]): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(dataArray);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        console.log("Data stored successfully");
    } catch (e) {
        console.error("Error storing data:", e);
    }
};

/**
 * Get array from AsyncStorage
 * Always returns an array (empty if nothing stored)
 */
export const getData = async <T = any>(): Promise<T[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) as T[] : [];
    } catch (e) {
        console.error("Error retrieving data:", e);
        return [];
    }
};

/**
 * Delete data from AsyncStorage
 */
export const deleteData = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
        console.log("Data deleted successfully");
    } catch (e) {
        console.error("Error deleting data:", e);
    }
};
