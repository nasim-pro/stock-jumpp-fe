import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StockList from './StockList';
import StockDetails from './StockDetails';
import Watchlist from "./WatchList";


const Stack = createNativeStackNavigator();
// ✅ Reuse the same components for watchlist
 function WatchlistStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#9DB2BF' },
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <Stack.Screen
                name="Watchlist"
                component={Watchlist}
                options={{ title: 'My Watchlist' }} // just change the title
                initialParams={{ mode: 'watchlist' }} // pass a mode flag
            />
            <Stack.Screen
                name="StockDetails"
                component={StockDetails}
                options={{ title: 'Stock Details' }}
            />
        </Stack.Navigator>
    );
}

export default WatchlistStack;