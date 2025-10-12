import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { mainDriver } from '../main-driver';

const { AlarmManagerModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(AlarmManagerModule);

// 1️⃣ Function to schedule 5 AM alarm — now fully handles AsyncStorage
export const scheduleFiveAMTask = async () => {
    const alreadyScheduled = await AsyncStorage.getItem('fiveAMScheduled');
    if (!alreadyScheduled) {
        await AsyncStorage.setItem('fiveAMScheduled', 'true');
        AlarmManagerModule.scheduleFiveAMTask();
        console.log('⏰ 5 AM alarm scheduled');
    } else {
        console.log('⏰ 5 AM alarm already scheduled');
    }
};

// 2️⃣ Listen for native event when alarm triggers
eventEmitter.addListener('runAtFiveAM', () => {
    console.log('🔥 Running scheduled JS code at 5 AM!');
    runFiveAMTask();
});

// 3️⃣ Async function that executes your custom 5 AM logic
async function runFiveAMTask() {
    try {
        await mainDriver(); // <-- your async logic
        console.log('✅ 5 AM task completed');
    } catch (error) {
        console.error('❌ Error running 5 AM task:', error);
    }
}
