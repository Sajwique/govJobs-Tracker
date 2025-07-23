import { useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  SectionList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { client } from "@/lib/sanity/client";
import { formatDate, formatDuration } from "@/lib/utils";
import ExerciseCard from "@/components/ExerciseCard";

import { Job } from "gov-sanity/sanity.types";
import { defineQuery } from "groq";

export const activeJobQuery = defineQuery(
  `*[_type == "job" && isActive == true]`
);

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();

  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorkouts = async () => {
    if (!user?.id) return;

    try {
      const allActiveJobs = await client.fetch(activeJobQuery);
      setActiveJobs(allActiveJobs);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkouts();
    setRefreshing(false);
  };

  // Group jobs by department for section list
  const jobsByDepartment = activeJobs.reduce(
    (acc: { [key: string]: Job[] }, job) => {
      const dept = job?.title || "";
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(job);
      return acc;
    },
    {}
  );

  const sectionData = Object.keys(jobsByDepartment).map((dept) => ({
    title: dept,
    data: jobsByDepartment[dept],
  }));

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={"large"} color={"#0000ff"} />
          <Text className="text-gray-500 text-center">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className=" flex-1 flex-row bg-gray-50 pt-14">
      <View>
        <FlatList
          data={[]}
          renderItem={null}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2563EB"]}
            />
          }
          ListHeaderComponent={
            <>
              {/* Featured Jobs Banner */}
              <ScrollView
                className="flex-1 "
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >
                {/* Header */}
                <View className="px-6 pt-8 pb-6">
                  <Text className="text-lg text-gray-600">Welcome back,</Text>
                  <Text className="text-3xl font-bold text-gray-900">
                    {user?.firstName || "Athlete"}! 💪
                  </Text>
                </View>
                {/* Active Jobs */}
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 24,
                    flexDirection: "row",
                    gap: 4,
                  }}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      colors={["#3B82F6"]}
                      tintColor={"#3B82F6"}
                      title="Pull to refresh exercise"
                      titleColor={"#6B7280"}
                    />
                  }
                >
                  {activeJobs &&
                    activeJobs.map((job) => (
                      <ExerciseCard
                        key={job._id}
                        isHorizontal={true}
                        item={job}
                        onPress={() =>
                          router.push(`/exercise-detail?id=${job._id}`)
                        }
                      />
                    ))}
                </ScrollView>
              </ScrollView>
              <View className="mx-6 my-2 bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <View className="flex-row justify-between">
                  <View className="flex-1 pr-2">
                    <Text className="text-lg font-bold text-gray-900">
                      Featured Positions
                    </Text>
                    <Text className="text-sm text-gray-600 mt-1">
                      High-priority openings with upcoming deadlines
                    </Text>
                    <TouchableOpacity
                      className="mt-3 bg-blue-600 py-2 px-4 rounded-lg self-start"
                      onPress={() => router.push("/featured")}
                    >
                      <Text className="text-white font-medium">View All</Text>
                    </TouchableOpacity>
                  </View>
                  <Image
                    //  source={require("@/assets/images/government-building.png")}
                    className="w-24 h-24"
                  />
                </View>
              </View>
            </>
          }
          ListFooterComponent={
            <View className="px-0">
              {/* Jobs by Department */}
              <View className="px-6 pt-2">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-bold text-gray-900">
                    Available Jobs
                  </Text>
                  <TouchableOpacity onPress={() => router.push("/jobs")}>
                    <Text className="text-blue-600 font-medium">All Jobs</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Department Sections */}
              <SectionList
                sections={sectionData}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <ExerciseCard
                    item={item}
                    onPress={() => router.push(`/job-detail?id=${item._id}`)}
                  />
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <View className="bg-gray-100 px-6 py-3 border-t border-b border-gray-200">
                    <Text className="font-bold text-gray-700">{title}</Text>
                  </View>
                )}
                scrollEnabled={false}
              />
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
