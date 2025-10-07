import BackgroundFetch from 'react-native-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mainDriver } from '../main-driver';

const LAST_RUN_KEY = 'last_run_date';

/**
 * Initializes BackgroundFetch to run around 5 AM daily (only once per day).
 */
export const initBackgroundScheduler = async () => {
    try {
        const status = await BackgroundFetch.configure(
            {
                minimumFetchInterval: 30, // check every 30 minutes
                stopOnTerminate: false,
                startOnBoot: true,
                enableHeadless: true,
                requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
            },
            async (taskId) => {
                console.log('[BackgroundFetch] Task received:', taskId);
                try {
                    const now = new Date();
                    const hour = now.getHours();
                    const today = now.toDateString(); // e.g., "Tue Oct 08 2025"

                    // Get last run date
                    const lastRun = await AsyncStorage.getItem(LAST_RUN_KEY);

                    if (hour === 5 && lastRun !== today) {
                        console.log('[BackgroundFetch] Running mainDriver at 5 AM...');
                        try {
                            await mainDriver();
                            await AsyncStorage.setItem(LAST_RUN_KEY, today);
                            console.log('[BackgroundFetch] Task completed successfully');
                        } catch (err) {
                            console.error('[BackgroundFetch] mainDriver error:', err);
                        }
                    } else {
                        console.log(`[BackgroundFetch] Skipped. Hour=${hour}, LastRun=${lastRun}`);
                    }
                } catch (err) {
                    console.error('[BackgroundFetch] Error during fetch:', err);
                }

                BackgroundFetch.finish(taskId);
            },
            (error) => {
                console.error('[BackgroundFetch] Failed to start:', error);
            },
        );

        console.log('[BackgroundFetch] Configured with status:', status);
    } catch (err) {
        console.error('[BackgroundFetch] Initialization failed:', err);
    }
};
