import React from "react";
import { Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { ActivityIndicator, Text, View } from "react-native";

const Layout = () => {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={"large"} color={"0000ff"} />
        <Text>...Loading</Text>
      </View>
    );
  }
  return (
    <Stack>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="job-detail"
          options={{
            headerShown: false,
            presentation: "modal",
            gestureEnabled: true,
            animationTypeForReplace: "push",
          }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
};

export default Layout;
