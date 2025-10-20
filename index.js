/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee from '@notifee/react-native';
import BackgroundFetch from 'react-native-background-fetch';
import { headlessTask } from './webScraper/utility/backgroundScheduler';


// ✅ Background Event Handler
notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.DELIVERED) {
        await mainDriver();
    }
});

AppRegistry.registerComponent(appName, () => App);

// // Register headless task globally (outside React)
// BackgroundFetch.registerHeadlessTask(headlessTask);