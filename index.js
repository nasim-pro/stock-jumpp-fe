/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import BackgroundFetch from 'react-native-background-fetch';
import { headlessTask } from './webScraper/utility/backgroundScheduler';


AppRegistry.registerComponent(appName, () => App);

// Register headless task globally (outside React)
BackgroundFetch.registerHeadlessTask(headlessTask);