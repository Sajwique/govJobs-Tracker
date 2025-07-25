import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { client } from "@/lib/sanity/client";
import Entypo from "@expo/vector-icons/Entypo";
import { jobQuery } from "@/lib/utils";
import JobCard from "@/components/JobCard";
import { Job } from "@/lib/sanity/sanity.types";

//Define the query outside the components for  proper type generations

const exercises = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [filterJobs, setfilterJobs] = React.useState([]);
  const router = useRouter();

  const fetchJobs = async () => {
    try {
      const jobs = await client.fetch(jobQuery);
      setJobs(jobs);
      setfilterJobs(jobs);
    } catch (e) {
      // console.log("Error Fetching exercise :", e);
      Alert.alert("Error", e.message);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter((exercise) =>
      exercise.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setfilterJobs(filtered);
  }, [searchQuery, jobs]);
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Jobs Library</Text>
        <Text className="text-gray-600 ml-1">
          Discover latest govemrent Jobs and apply online
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-1 mt-4">
          <Ionicons name="search" size={20} color={"#6B7280"} />
          <TextInput
            placeholder="Search exercise..."
            placeholderTextColor={"#9CA3AF"}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-gray-800"
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={"#6B7280"} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Exercise List */}
      <FlatList
        data={filterJobs}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]} //Android
            tintColor={"#3B82F6"} // iOS
            title="Pull to refresh exercise" // iOS
            titleColor={"#6B7280"} //iOS
          />
        }
        ListEmptyComponent={
          <View className="bg-white rounded-2xl p-8 items-center">
            {/* <Ionicons name="fitness-outline" size={64} color={"#9CA3AF"} /> */}
            <Entypo name="text-document" size={64} color={"#9CA3AF"} />
            <Text className="text-xl font-semibold text-gray-900 mt-4">
              {searchQuery ? "No exercise found" : "Loading jobs..."}
            </Text>
            <Text className="text-gray-600 text-center mt-2">
              {searchQuery
                ? "Try adjusting your search"
                : "Your jobs will appear here"}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <JobCard
            item={item}
            onPress={() => router.push(`/job-detail?id=${item._id}`)}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default exercises;
