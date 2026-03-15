import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";
import { TherapistDashboardScreen } from "../screens/therapist/DashboardScreen";
import { ScheduleScreen } from "../screens/therapist/ScheduleScreen";
import { ClientsScreen } from "../screens/therapist/ClientsScreen";
import { ClientDetailScreen } from "../screens/therapist/ClientDetailScreen";
import { MessagesScreen } from "../screens/therapist/MessagesScreen";
import { MessageThreadScreen } from "../screens/patient/MessageThreadScreen";
import { TherapistProfileScreen } from "../screens/therapist/ProfileScreen";
import { colors } from "../theme";

const Tab = createBottomTabNavigator();
const ClientsStack = createNativeStackNavigator();
const MessagesStack = createNativeStackNavigator();

function ClientsStackNavigator() {
  return (
    <ClientsStack.Navigator screenOptions={{ headerShown: false }}>
      <ClientsStack.Screen name="Clients" component={ClientsScreen} />
      <ClientsStack.Screen name="ClientDetail" component={ClientDetailScreen} />
    </ClientsStack.Navigator>
  );
}

function MessagesStackNavigator() {
  return (
    <MessagesStack.Navigator screenOptions={{ headerShown: false }}>
      <MessagesStack.Screen name="Messages" component={MessagesScreen} />
      <MessagesStack.Screen name="MessageThread" component={MessageThreadScreen} />
    </MessagesStack.Navigator>
  );
}

export function TherapistNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarActiveBackgroundColor: colors.card,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#94a3b8",
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tab.Screen
        name="TodayTab"
        component={TherapistDashboardScreen}
        options={{ title: "Today", tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🗓</Text> }}
      />
      <Tab.Screen
        name="ScheduleTab"
        component={ScheduleScreen}
        options={{ title: "Schedule", tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📋</Text> }}
      />
      <Tab.Screen
        name="ClientsTab"
        component={ClientsStackNavigator}
        options={{ title: "Clients", tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👥</Text> }}
      />
      <Tab.Screen
        name="MessagesTab"
        component={MessagesStackNavigator}
        options={{ title: "Messages", tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>💬</Text> }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={TherapistProfileScreen}
        options={{ title: "Profile", tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text> }}
      />
    </Tab.Navigator>
  );
}
