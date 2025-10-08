import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StockList from './StockList';
import StockDetails from './StockDetails';
import Settings from './Settings';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function StocksStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="StockList" component={StockList} options={{ title: 'Stocks' }} />
            <Stack.Screen name="StockDetails" component={StockDetails} options={{ title: 'Details' }} />
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="Stocks"
                component={StocksStack}
                options={{ tabBarLabel: ({ focused }) => <Text style={{ color: focused ? '#007AFF' : '#666' }}>Stocks</Text> }}
            />
            <Tab.Screen
                name="Settings"
                component={Settings}
                options={{ tabBarLabel: ({ focused }) => <Text style={{ color: focused ? '#007AFF' : '#666' }}>Settings</Text> }}
            />
        </Tab.Navigator>
    );
}
