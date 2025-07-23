import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Image } from "react-native";
import { useUser } from "@clerk/clerk-expo";

const Layout = () => {
  const { user } = useUser();

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="jobs"
        options={{
          headerShown: false,
          title: "Jobs",

          tabBarIcon: ({ color, size }) => (
            <AntDesign name="book" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="notification"
        options={{
          headerShown: false,
          title: "Notification",

          tabBarIcon: ({ color, size }) => (
            <AntDesign name="clockcircle" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",

          tabBarIcon: ({ color, size }) => (
            <Image
              source={{
                uri: user.imageUrl
                  ? user?.externalAccounts[0].imageUrl
                  : user.imageUrl,
              }}
              className="rounded-full"
              style={{ width: 28, height: 28, borderRadius: 100 }}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
