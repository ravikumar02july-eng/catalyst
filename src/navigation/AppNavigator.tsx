import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ScreenerScreen from '../screens/ScreenerScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import StockDetailScreen from '../screens/StockDetailScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'Screener') iconName = focused ? 'options' : 'options-outline';
          if (route.name === 'Watchlist') iconName = focused ? 'star' : 'star-outline';
          if (route.name === 'Portfolio') iconName = focused ? 'pie-chart' : 'pie-chart-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Screener" component={ScreenerScreen} />
      <Tab.Screen name="Watchlist" component={WatchlistScreen} />
      <Tab.Screen name="Portfolio" component={PortfolioScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <RootStack.Screen
        name="StockDetail"
        component={StockDetailScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleAlign: 'center',
        }}
      />
    </RootStack.Navigator>
  );
}
