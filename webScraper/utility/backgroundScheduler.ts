// import BackgroundFetch from 'react-native-background-fetch';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { mainDriver } from '../main-driver';

// const LAST_RUN_KEY = 'last_run_date';

// /**
//  * Initializes BackgroundFetch to run around 5 AM daily (only once per day).
//  */
// export const initBackgroundScheduler = async () => {
//     try {
//         const status = await BackgroundFetch.configure(
//             {
//                 minimumFetchInterval: 30, // check every 30 minutes
//                 stopOnTerminate: false,
//                 startOnBoot: true,
//                 enableHeadless: true,
//                 requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
//             },
//             async (taskId) => {
//                 console.log('[BackgroundFetch] Task received:', taskId);
//                 try {
//                     const now = new Date();
//                     const hour = now.getHours();
//                     const today = now.toDateString(); // e.g., "Tue Oct 08 2025"

//                     // Get last run date
//                     const lastRun = await AsyncStorage.getItem(LAST_RUN_KEY);

//                     if (hour === 5 && lastRun !== today) {
//                         console.log('[BackgroundFetch] Running mainDriver at 5 AM...');
//                         try {
//                             await mainDriver();
//                             await AsyncStorage.setItem(LAST_RUN_KEY, today);
//                             console.log('[BackgroundFetch] Task completed successfully');
//                         } catch (err) {
//                             console.error('[BackgroundFetch] mainDriver error:', err);
//                         }
//                     } else {
//                         console.log(`[BackgroundFetch] Skipped. Hour=${hour}, LastRun=${lastRun}`);
//                     }
//                 } catch (err) {
//                     console.error('[BackgroundFetch] Error during fetch:', err);
//                 }

//                 BackgroundFetch.finish(taskId);
//             },
//             (error) => {
//                 console.error('[BackgroundFetch] Failed to start:', error);
//             },
//         );

//         console.log('[BackgroundFetch] Configured with status:', status);
//     } catch (err) {
//         console.error('[BackgroundFetch] Initialization failed:', err);
//     }
// };


// src/utils/backgroundScheduler.ts
import BackgroundFetch, { HeadlessEvent } from 'react-native-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mainDriver } from '../main-driver';

const LAST_RUN_KEY = 'last_run_date';
let alreadyInitialized = false;

/**
 * Calculate delay (ms) until next 5 AM.
 */
function getDelayUntilNext5AM(): number {
    const now = new Date();
    const target = new Date();
    target.setHours(5, 0, 0, 0);

    // If 5 AM already passed today, schedule for tomorrow
    if (target <= now) {
        target.setDate(target.getDate() + 1);
    }

    return target.getTime() - now.getTime();
}

/**
 * Schedules a one-time task to run at 5 AM using AlarmManager.
 * The task is re-scheduled automatically after running.
 */
export async function scheduleDaily5AMTask() {
    try {
        const delay = getDelayUntilNext5AM();

        await BackgroundFetch.scheduleTask({
            taskId: 'com.stockjumpp.daily5am',
            forceAlarmManager: true, // ensures it can wake the device
            delay, // milliseconds until 5 AM
            periodic: false, // one-time task (we’ll re-schedule manually)
            stopOnTerminate: false,
            enableHeadless: true,
            requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
        });

        console.log(`[BackgroundFetch] Daily task scheduled for 5 AM in ${(delay / 3600000).toFixed(2)} hours`);
    } catch (error) {
        console.error('[BackgroundFetch] Failed to schedule daily 5 AM task:', error);
    }
}

/**
 * Initializes BackgroundFetch and schedules the first task.
 * Should be called once in App.tsx.
 */
export async function initBackgroundScheduler() {
    try {
        if (alreadyInitialized) return;
        
        const status = await BackgroundFetch.configure(
            {
                minimumFetchInterval: 60 * 12, // Fallback: every 12 hours
                stopOnTerminate: false,
                startOnBoot: true,
                enableHeadless: true,
                requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
            },
            async (taskId) => {
                console.log('[BackgroundFetch] Event received:', taskId);
                await runDailyTask(taskId);
            },
            (error) => {
                console.error('[BackgroundFetch] Configure failed:', error);
            }
        );
        alreadyInitialized = true;
        console.log('[BackgroundFetch] Initialized with status:', status);
        await scheduleDaily5AMTask();
    } catch (error) {
        console.error('[BackgroundFetch] initBackgroundScheduler error:', error);
    }
}

/**
 * Executes main task logic and re-schedules the next run.
 */
async function runDailyTask(taskId: string) {
    try {
        const now = new Date();
        const today = now.toDateString();
        const lastRun = await AsyncStorage.getItem(LAST_RUN_KEY);

        if (lastRun === today) {
            console.log('[BackgroundFetch] Already ran today, skipping.');
        } else {
            const hour = now.getHours();

            if (hour === 5) {
                console.log('[BackgroundFetch] Running mainDriver() at 5 AM...');
                await mainDriver();
                await AsyncStorage.setItem(LAST_RUN_KEY, today);
                console.log('[BackgroundFetch] mainDriver() completed.');
            } else {
                console.log(`[BackgroundFetch] Not 5 AM yet. Current hour = ${hour}`);
            }
        }
    } catch (error) {
        console.error('[BackgroundFetch] runDailyTask error:', error);
    } finally {
        await scheduleDaily5AMTask(); // reschedule next 5 AM task
        BackgroundFetch.finish(taskId);
    }
}

/**
 * Headless task handler (runs even if app is terminated).
 */
export const headlessTask = async (event: HeadlessEvent) => {
    console.log('[BackgroundFetch HeadlessTask] Received event:', event.taskId);
    await runDailyTask(event.taskId);
    BackgroundFetch.finish(event.taskId);
};
