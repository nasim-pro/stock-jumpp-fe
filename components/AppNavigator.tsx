

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // or '@expo/vector-icons' if using Expo
import StockList from './StockList';
import StockDetails from './StockDetails';
import Settings from './Settings';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function StocksStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#9DB2BF' },
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <Stack.Screen
                name="StockList"
                component={StockList}
                options={{ title: 'Stocks List' }}
            />
            <Stack.Screen
                name="StockDetails"
                component={StockDetails}
                options={{ title: 'Stock Details' }}
            />
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#9DB2BF',
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 70, // slightly taller for icon+text spacing
                    paddingBottom: 15
                },
                tabBarLabelStyle: {
                    fontSize: 14,
                    marginBottom: 6, // moves text closer to icon visually centered
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Stocks') {
                        iconName = focused ? 'trending-up' : 'trending-up-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }
                    return (
                        <Icon
                            name={iconName || ''}
                            size={26} // slightly bigger
                            color={focused ? '#000000ff' : '#666'}
                            style={{ marginTop: 4 }} // visually centers the pair
                        />
                    );
                },
                tabBarActiveTintColor: '#000',
                tabBarInactiveTintColor: '#666',
            })}
        >
            <Tab.Screen name="Stocks" component={StocksStack} />
            <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
    );
}

