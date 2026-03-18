import { Text, View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Logo } from '@/components/Logo';
import { useTheme } from '@/contexts/ThemeContext';
import { FontSize } from '@/constants/theme';

const TabIcon = ({ name, color }: { name: string; color: string }) => {
  return <Text style={{ fontSize: 24, color }}>{name}</Text>;
};

export default function TabsLayout() {
  const { theme } = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.white,
          borderTopColor: theme.borderLight,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
        },
        headerStyle: {
          backgroundColor: theme.white,
        },
        headerTintColor: theme.text,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon name="🏠" color={color} />,
          headerTitle: () => (
            <View style={styles.headerLogo}>
              <Logo size="small" showText={false} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="log-food"
        options={{
          title: 'Log Food',
          tabBarIcon: ({ color }) => <TabIcon name="📸" color={color} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => <TabIcon name="🏃" color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color }) => <TabIcon name="📊" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon name="👤" color={color} />,
        }}
      />
      <Tabs.Screen
        name="manual-entry"
        options={{
          title: 'Manual Entry',
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="edit-profile"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="meal-planner"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
