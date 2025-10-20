import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'stock';
const WATCHLIST_KEY = 'watchlist';

/**
 * Store array in AsyncStorage
 * @param dataArray Array of any type
 */
export const storeDataLocally = async (dataArray: any[]): Promise<void> => {
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
export const getDataLocally = async <T = any>(): Promise<T[]> => {
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
export const deleteDataLocally = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
        console.log("Data deleted successfully");
    } catch (e) {
        console.error("Error deleting data:", e);
    }
};



// ✅ Generate a unique ID with timestamp + random component
const generateId = (): string => {
    const randomPart = Math.random().toString(36).substr(2, 9);
    const timestamp = Date.now().toString(36);
    return `watch_${timestamp}_${randomPart}`;
};

// ✅ Add an item to the watchlist
export const addToWatchlist = async (item: any): Promise<void> => {
    try {
        const data = await AsyncStorage.getItem(WATCHLIST_KEY);
        const watchlist = data ? JSON.parse(data) : [];

        // Assign unique ID and timestamp
        const newItem = {
            ...item,
            _watchlistId: generateId(),
            addedAt: new Date().toISOString(),
        };

        watchlist.push(newItem);
        await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    } catch (error) {
        console.error('Error adding to watchlist:', error);
    }
};

// ✅ Remove an item from the watchlist by its generated ID
export const removeFromWatchlist = async (stock: any): Promise<void> => {
    try {
        const watchlistId = stock?._watchlistId;
        const data = await AsyncStorage.getItem(WATCHLIST_KEY);
        let watchlist = data ? JSON.parse(data) : [];

        watchlist = watchlist.filter((i: any) => i._watchlistId !== watchlistId);
        await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    } catch (error) {
        console.error('Error removing from watchlist:', error);
    }
};

// ✅ Get the full watchlist
export const getWatchlist = async (): Promise<any[]> => {
    try {
        const data = await AsyncStorage.getItem(WATCHLIST_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        return [];
    }
};