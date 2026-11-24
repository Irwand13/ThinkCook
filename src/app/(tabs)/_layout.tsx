import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { colors, fonts, radius, shadows } from '../../constants/styles';

type IoniconsName = keyof typeof Ionicons.glyphMap;

function TabIcon({
  focused,
  activeName,
  inactiveName,
}: {
  focused: boolean;
  activeName: IoniconsName;
  inactiveName: IoniconsName;
}) {
  return (
    <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
      <Ionicons
        name={focused ? activeName : inactiveName}
        size={26}
        color={focused ? colors.white : colors.text}
      />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.text,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: 16,
          height: 72,
          borderRadius: radius.xl,
          backgroundColor: colors.card,
          borderTopWidth: 0,
          paddingTop: 6,
          paddingBottom: 6,
          ...shadows.floating,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.bodySemi,
          fontSize: 11,
          marginTop: 3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarAccessibilityLabel: 'Tab Beranda',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeName="home"
              inactiveName="home-outline"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Cari',
          tabBarAccessibilityLabel: 'Tab Cari',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeName="search"
              inactiveName="search-outline"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: 'Favorit',
          tabBarAccessibilityLabel: 'Tab Favorit',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeName="heart"
              inactiveName="heart-outline"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarAccessibilityLabel: 'Tab Profil',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeName="person"
              inactiveName="person-outline"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const tabStyles = StyleSheet.create({
  iconWrap: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.primaryDark,
  },
});
