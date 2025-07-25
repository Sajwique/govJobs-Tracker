import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { defineQuery } from "groq";
import { client } from "@/lib/sanity/client";
import { adimtCardQuery, resultQuery, supportData } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import JobCardsSection from "@/components/JobCardsSection";
import SupportMe from "@/components/SupportMe";
import { StatusBar } from "react-native";

export const getWorkoutsQuery =
  defineQuery(`*[_type == 'workout' && UserId == $UserId] | order(date desc){
      _id,
      date,
      duration,
      exercises[]{
        exercise-> {
          _id,
          name
        }, 
        sets[]{
          reps,
          weight,
          weightUnit,
          _type,
          _key
        },
        _type,
        _key
      }
    }`);

export default function NotificationPage() {
  const [admitCard, setAdmitCard] = useState([]);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);

  const [refreshing, setRefershing] = useState(false);

  const { user } = useUser();
  const { refresh } = useLocalSearchParams();

  const fetchWorkouts = async () => {
    if (!user?.id) return;

    try {
      const admitCard = await client.fetch(adimtCardQuery);
      const result = await client.fetch(resultQuery);
      setAdmitCard(admitCard);
      setResult(result);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
      setRefershing(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user?.id]);

  useEffect(() => {
    if (refresh == "true") {
      fetchWorkouts();
    }
  }, [refresh]);

  const onRefresh = () => {
    setRefershing(true);
    fetchWorkouts();
  };

  const handleSupportPress = () => {
    setShowPayment(!showPayment);
  };

  const openScanner = () => {
    Linking.openURL(supportData.payment_list.upi_scanner);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1">
        <View className="px-6 py-4 bg-white border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">Notification</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={"large"} color={"#3B82F6"} />
          <Text className="text-gray-600 mt-4">
            Loading your notification...
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className=" flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      {/* Header */}
      {/* <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
          />
        }
      > */}
      {/* <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          Notification History
        </Text>
      </View> */}

      <JobCardsSection
        admitCards={admitCard}
        results={result}
        loading={loading}
      />
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}
