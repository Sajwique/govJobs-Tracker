import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { client, urlFor } from "@/lib/sanity/client";
import { defineQuery } from "groq";
import Markdown from "react-native-markdown-display";
import JobDetailCard from "@/components/JobDetailCard";

const singleJobQuery = defineQuery(`*[_type == 'job' && _id == $id][0]`);

const ExerciseDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  console.log("id", id);
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercise = async () => {
      if (!id) return;
      try {
        const jobData = await client.fetch(singleJobQuery, { id });
        setJob(jobData);
      } catch (error) {
        console.log("error :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={"large"} color={"#0000ff"} />
          <Text className="text-gray-500">Loading job...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Job not found : {id}</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white py-14">
      {/* Header with close button */}
      <View className="absolute top-2 right-0 z-10 px-4 mt-12">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center backdrop-blur-sm bg-black/20"
        >
          <Ionicons name="close" size={24} color={"white"} />
        </TouchableOpacity>
      </View>

      <View className="h-40 bg-white relative mt-5">
        {job?.image ? (
          <Image
            source={{ uri: urlFor(job.image?.asset?._ref).url() }}
            className="w-full h-full"
            resizeMode="contain"
          />
        ) : (
          <View className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 items-center justify-center">
            <Ionicons name="fitness" size={80} color={"white"} />
          </View>
        )}

        {/* Gradient overlay */}
        <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent"></View>

        {/* Content */}
        <View className="px-6 py-6">
          {/* title and difficulty */}
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1 mr-4">
              <Text className="text-3xl font-bold text-gray-800 mb-2">
                {job?.title}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-xl font-semibold text-gray-800 mb-1">
              Description
            </Text>
            <Text className="text-gray-600 leading-6 text-base">
              {job?.description ||
                "No description is available for this exercise."}
            </Text>
          </View>
        </View>
      </View>

      <JobDetailCard job={job} />
    </SafeAreaView>
  );
};

export default ExerciseDetails;
