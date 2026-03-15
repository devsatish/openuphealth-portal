import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";
import { DashboardScreen } from "../screens/patient/DashboardScreen";
import { AppointmentsScreen } from "../screens/patient/AppointmentsScreen";
import { AppointmentDetailScreen } from "../screens/patient/AppointmentDetailScreen";
import { MessagesScreen } from "../screens/patient/MessagesScreen";
import { MessageThreadScreen } from "../screens/patient/MessageThreadScreen";
import { WellnessScreen } from "../screens/patient/WellnessScreen";
import { CheckinsScreen } from "../screens/patient/CheckinsScreen";
import { ProfileScreen } from "../screens/patient/ProfileScreen";
import { BillingScreen } from "../screens/patient/BillingScreen";
import { InsuranceScreen } from "../screens/patient/InsuranceScreen";
import { CrisisScreen } from "../screens/patient/CrisisScreen";
import { colors } from "../theme";

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const AppointmentsStack = createNativeStackNavigator();
const MessagesStack = createNativeStackNavigator();
const WellnessStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Dashboard" component={DashboardScreen} />
    </HomeStack.Navigator>
  );
}

function AppointmentsStackNavigator() {
  return (
    <AppointmentsStack.Navigator screenOptions={{ headerShown: false }}>
      <AppointmentsStack.Screen name="Appointments" component={AppointmentsScreen} />
      <AppointmentsStack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />
    </AppointmentsStack.Navigator>
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

function WellnessStackNavigator() {
  return (
    <WellnessStack.Navigator screenOptions={{ headerShown: false }}>
      <WellnessStack.Screen name="Wellness" component={WellnessScreen} />
      <WellnessStack.Screen name="Checkins" component={CheckinsScreen} />
    </WellnessStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="Billing" component={BillingScreen} />
      <ProfileStack.Screen name="Insurance" component={InsuranceScreen} />
      <ProfileStack.Screen name="Crisis" component={CrisisScreen} />
    </ProfileStack.Navigator>
  );
}

export function PatientNavigator() {
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
        name="HomeTab"
        component={HomeStackNavigator}
        options={{ title: "Home", tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text> }}
      />
      <Tab.Screen
        name="AppointmentsTab"
        component={AppointmentsStackNavigator}
        options={{ title: "Appointments", tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📅</Text> }}
      />
      <Tab.Screen
        name="MessagesTab"
        component={MessagesStackNavigator}
        options={{ title: "Messages", tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>💬</Text> }}
      />
      <Tab.Screen
        name="WellnessTab"
        component={WellnessStackNavigator}
        options={{ title: "Wellness", tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>💚</Text> }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{ title: "Profile", tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text> }}
      />
    </Tab.Navigator>
  );
}
