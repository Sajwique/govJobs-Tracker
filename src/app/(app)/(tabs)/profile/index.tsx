import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { client } from "@/lib/sanity/client";
import { getWorkoutsQuery } from "../notification";
import { formatDuration } from "@/lib/utils";
import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import SupportMe from "@/components/SupportMe";

const ProfilePage = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const socialLinks = {
    instagram: "YOUR_INSTAGRAM_URL",
    twitter: "YOUR_TWITTER_URL",
    linkedin: "YOUR_LINKEDIN_URL",
  };

  const handleRateApp = () => {
    Linking.openURL(
      "https://play.google.com/store/apps/details?id=com.yourapp"
    );
  };

  const handleSendFeedback = () => {
    const phone = "+918851505898";
    const url = `whatsapp://send?phone=${phone}&text=${""}}`;

    Linking.openURL(url).catch(() => {
      alert("WhatsApp is not installed");
    });
  };

  const handleSocialPress = (platform) => {
    Linking.openURL(socialLinks[platform]);
  };

  const fetchWorkouts = async () => {
    if (!user?.id) return;

    try {
      const results = await client.fetch(getWorkoutsQuery, {
        UserId: user.id,
      });

      console.log("results: ", results);
      setWorkouts(results);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user?.id]);

  // Calculate days since joining (using createAt from clerk)
  const joiningDate = user?.createdAt ? new Date(user?.createdAt) : new Date();
  const daysSinceJoining = Math.floor(
    (new Date().getTime() - joiningDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={"large"} color={"#0000ff"} />
          <Text className="text-gray-500">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => signOut() },
    ]);
  };
  return (
    <SafeAreaView className="flex flex-1">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-8 pd-6">
          <Text className="text-3xl font-bold text-gray-900">Profile</Text>
          <Text className="text-lg text-gray-600 mt-1">
            Manage your account and stats
          </Text>
        </View>

        {/* User Info Card */}
        <View className="px-6 my-6">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="w-16 h-16 bg-blue-600 rounded-full items-center justify-center mr-4">
                <Image
                  source={{
                    uri: user.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
                  }}
                  className="rounded-full"
                  style={{ width: 64, height: 64 }}
                />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-semibold text-gray-900">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.firstName || "Warrior 💪"}
                </Text>
                <Text className="text-gray-600 text-sm">
                  {user?.emailAddresses?.[0]?.emailAddress}
                </Text>
                <Text>Member since {formatJoinDate(joiningDate)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SignOut Button */}
        <View className="px-6 mb-8">
          {/* Rate App Section */}
          <TouchableOpacity
            className="bg-white p-5 rounded-xl shadow-sm mb-6 mt-2 flex-row items-center"
            onPress={handleRateApp}
          >
            <FontAwesome name="star" size={24} color="#F59E0B" />
            <Text className="ml-4 text-lg font-medium">Rate Our App</Text>
          </TouchableOpacity>

          {/* Feedback Section */}
          <TouchableOpacity
            className="bg-white p-5 rounded-xl shadow-sm mb-6 flex-row items-center"
            onPress={handleSendFeedback}
          >
            <FontAwesome5 name="whatsapp" size={24} color="#25D366" />
            <Text className="ml-4 text-lg font-medium">Send Feedback</Text>
          </TouchableOpacity>

          {/* Social Media Section */}
          <View className="bg-white p-5 rounded-xl shadow-sm">
            <Text className="text-lg font-medium mb-4">Follow Us</Text>
            <View className="flex-row justify-around">
              <TouchableOpacity
                className="items-center"
                onPress={() => handleSocialPress("instagram")}
              >
                <View className="bg-pink-100 p-4 rounded-full">
                  <FontAwesome5 name="instagram" size={24} color="#E1306C" />
                </View>
                <Text className="mt-2 text-gray-600">Instagram</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center"
                onPress={() => handleSocialPress("twitter")}
              >
                <View className="bg-blue-100 p-4 rounded-full">
                  <FontAwesome5 name="twitter" size={24} color="#1DA1F2" />
                </View>
                <Text className="mt-2 text-gray-600">Twitter</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center"
                onPress={() => handleSocialPress("linkedin")}
              >
                <View className="bg-blue-200 p-4 rounded-full">
                  <FontAwesome5 name="linkedin" size={24} color="#0077B5" />
                </View>
                <Text className="mt-2 text-gray-600">LinkedIn</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-white p-5 rounded-xl shadow-sm mt-3">
            <Text className="text-red-600 font-semibold text-md">
              Disclaimer
            </Text>
            <Text className="text-sm  text-left pt-3">
              This App is a private app that is not associated, endorsed or
              affiliated with any government institution, agency or department.
              The content available on this app is for informational purposes
              only and has been compiled from various reliable sources. Although
              we endeavor to keep the information accurate and up to date, we
              make no representations or warranties of any kind, express or
              implied, about the completeness, accuracy, reliability,
              suitability or availability of the information
            </Text>
          </View>

          <View className="bg-yellow-400 border-[1px] border-gray-50 rounded-xl mt-6 py-3 px-3">
            <Text className="text-lg font-bold text-black">
              This is Beta Verison of the App
            </Text>
          </View>
        </View>

        <View className="px-2">
          <SupportMe />
        </View>
        <View className="mt-3 px-6 mb-8">
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-red-600 rounded-2xl p-4 shadow-sm mt-5"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="log-out-outline" size={20} color={"white"} />
              <Text className="text-white font-semibold text-lg ml-2">
                Sign Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfilePage;
