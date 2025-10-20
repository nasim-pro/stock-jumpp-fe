// DailyScheduler.ts
import notifee, { TimestampTrigger, TriggerType, RepeatFrequency, AndroidImportance, AlarmType } from '@notifee/react-native';
import { mainDriver } from '../main-driver';

const CHANNEL_ID = 'daily_5am_channel';
const TRIGGER_ID = 'daily_5am_trigger';

/**
 * Get next 5 AM timestamp in local time
 */
function getNext5AMTimestamp(): number {
    const h = 5;
    const m = 0;
    const s = 0;
    const ms = 0;
    const now = new Date();
    const next5AM = new Date();
    next5AM.setHours(h, m, s, ms);
    if (next5AM <= now) {
        next5AM.setDate(next5AM.getDate() + 1);
    }
    return next5AM.getTime();
}


/**
 * Initialize the scheduler
 */
export async function initBackgroundScheduler() {
    // Request permissions
    await notifee.requestPermission();
    
    // Check if the permission is already granted (optional but good practice)
    // const canSchedule = await notifee.hasPermission('android.permission.SCHEDULE_EXACT_ALARM');
    // if (!canSchedule) {
    //     // Open the exact alarm permission settings for the user to grant it
    //     await notifee.openAlarmPermissionSettings();
    // }

    const existingTriggerIds = await notifee.getTriggerNotificationIds()
    if (existingTriggerIds.includes(TRIGGER_ID)) {
        console.log('[Scheduler] 5 AM trigger already scheduled — skipping.');
        return; // ✅ Prevent duplicate scheduling
    }
    console.log("triggerIds", existingTriggerIds);
    // Create notification channel
    await notifee.createChannel({
        id: CHANNEL_ID,
        name: 'Daily 5 AM Scheduler',
        importance: AndroidImportance.HIGH,
    });

    // Schedule the new 5 AM repeating trigger
    const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: getNext5AMTimestamp(),
        repeatFrequency: RepeatFrequency.DAILY,
        // ensures wakeup reliability
        alarmManager: {
            type: AlarmType.SET_EXACT_AND_ALLOW_WHILE_IDLE 
        }, 
    };

    // const calcel = await notifee.cancelNotification(TRIGGER_ID);
    
    await notifee.createTriggerNotification(
        {
            id: TRIGGER_ID,
            title: 'Daily Task',
            body: 'Executing scheduled 5 AM job…',
            android: {
                channelId: CHANNEL_ID,
                pressAction: { id: 'default' },
            },
        },
        trigger,
    );

    console.log('[Scheduler] Daily 5 AM task scheduled successfully.');
}
