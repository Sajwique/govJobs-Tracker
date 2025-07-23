import { useUser } from "@clerk/clerk-expo";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { defineQuery } from "groq";
import { client } from "@/lib/sanity/client";
import { formatDate, formatDuration, getTotalSets } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const [workout, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefershing] = useState(false);

  const { user } = useUser();
  const { refresh } = useLocalSearchParams();
  const router = useRouter();

  const fetchWorkouts = async () => {
    if (!user?.id) return;

    try {
      const results = await client.fetch(getWorkoutsQuery, {
        UserId: user.id,
      });

      console.log("userId :", user.id);
      console.log("results: ", results);
      setWorkouts(results);
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
      router.replace("/(app)/(tabs)/history");
    }
  }, [refresh]);

  const onRefresh = () => {
    setRefershing(true);
    fetchWorkouts();
  };

  const formatWorkoutDurations = (seconds?: number) => {
    if (!seconds) {
      return "Durations not recorded";
    }
    return formatDuration(seconds);
  };

  const getExerciseName = (workout) => {
    return (
      workout.exercises?.map((ex) => ex.exercise?.name).filter(Boolean) || []
      // workout.
    );
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
    <SafeAreaView className=" flex-1 bg-gray-50 pt-14">
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          Notification History
        </Text>
      </View>

      {/* Workout List */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {workout.length === 0 ? (
          <View className="bg-white rounded-2xl p-8 items-center">
            <Entypo name="text-document" size={64} color={"#9CA3AF"} />
            <Text className="text-xl font-semibold text-gray-900 mt-4">
              No notification yet
            </Text>
            <Text className="text-gray-600 text-center mt-2">
              Your notification will appear here
            </Text>
          </View>
        ) : (
          <View className="space-y-4 gap-4">
            {workout.map((workout) => (
              <TouchableOpacity
                key={workout._id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                activeOpacity={0.7}
                onPress={() => {
                  router.push({
                    pathname: "/history/workout-record",
                    params: {
                      workoutId: workout._id,
                    },
                  });
                }}
              >
                {/* Workout Header */}
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900">
                      {formatDate(workout.date || "")}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Ionicons
                        name="time-outline"
                        size={16}
                        color={"#6B7280"}
                      />
                      <Text className="text-gray-600 ml-2">
                        {formatWorkoutDurations(workout.duration)}
                      </Text>
                    </View>
                  </View>

                  <View className="bg-blue-100 rounded-full w-12 h-12 items-center justify-center">
                    <Ionicons
                      name="fitness-outline"
                      size={24}
                      color={"#3B82F6"}
                    />
                  </View>
                </View>

                {/* Workout stats */}
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <View className="bg-gray-100 rounded-lg px-3 py-2 mr-3">
                      <Text className="text-sm font-medium text-gray-700">
                        {workout.exercises?.length || 0} exercise
                      </Text>
                    </View>
                    <View className="bg-gray-100 rounded-lg px-3 py-2">
                      <Text className="text-sm font-medium text-gray-700">
                        {getTotalSets(workout)} sets
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Workout list */}
                {workout.exercises && workout.exercises.length > 0 && (
                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Exercises :
                    </Text>
                    <View className="flex-row flex-wrap">
                      {getExerciseName(workout)
                        .slice(0, 3)
                        .map((name, index) => (
                          <View
                            key={index}
                            className="bg-blue-50 rounded-lg px-3 py-1 mr-2 mb-2"
                          >
                            <Text className="text-blue-700 text-sm font-medium">
                              {name}
                            </Text>
                          </View>
                        ))}
                      {getExerciseName(workout).length > 3 && (
                        <View className="bg-gray-100 rounded-lg px-3 py-1 mr-2 mb-2">
                          <Text className="text-gray-600 text-sm font-medium">
                            +{getExerciseName(workout).length - 3}more
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
