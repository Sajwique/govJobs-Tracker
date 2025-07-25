import { AdmitCard, Result } from "@/lib/sanity/sanity.types";
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  ScrollView,
} from "react-native";
import SupportMe from "./SupportMe";

const INITIAL_LOAD_COUNT = 5;
const LOAD_MORE_COUNT = 5;

interface CardProps {
  item: AdmitCard | Result;
  onPress: (url: string) => void;
}

const Card = ({ item, onPress }: CardProps) => (
  <View className="relative bg-white rounded-xl shadow-md p-4 mb-4">
    <View className="flex items-center justify-center bg-red-500 rounded-xl absolute -top-2 right-0 px-2">
      <Text className="text-center font-semibold text-white text-sm">new</Text>
    </View>
    <Text className="text-lg font-bold text-[#0F172A] mb-1">{item.title}</Text>

    {"publishedAt" in item && (
      <Text className="text-sm text-gray-500 mb-2">
        {new Date(item?._createdAt).toLocaleDateString()}
      </Text>
    )}

    {"description" in item && (
      <Text className="text-[#6B7280] mb-3" numberOfLines={2}>
        {item.description}
      </Text>
    )}

    {("officialLinks" in item || "buttons" in item) && (
      <View className="flex-row flex-wrap gap-2 mt-2">
        {(("officialLinks" in item ? item.officialLinks : item.buttons) && [])
          ?.slice(0, 2)
          .map((link, index) => (
            <TouchableOpacity
              key={index}
              className="bg-blue-500 py-1 px-3 rounded-full"
              onPress={() => onPress(link.url)}
            >
              <Text className="text-white text-xs">{link.label}</Text>
            </TouchableOpacity>
          ))}
      </View>
    )}
  </View>
);

interface CardsSectionProps {
  title: string;
  data: Array<AdmitCard | Result>;
}

const CardsSection = ({ title, data }: CardsSectionProps) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD_COUNT);
  const visibleData = data.slice(0, visibleCount);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
  }, []);

  return (
    <View className="mb-8">
      <Text className="text-2xl font-bold text-blue-700 mb-4">{title}</Text>

      <FlatList
        data={visibleData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card item={item} onPress={(url) => Linking.openURL(url)} />
        )}
        ListFooterComponent={
          visibleCount < data.length ? (
            <TouchableOpacity className="py-3 items-center" onPress={loadMore}>
              <Text className="text-blue-500 font-medium">
                Load More ({data.length - visibleCount} remaining)
              </Text>
            </TouchableOpacity>
          ) : null
        }
        scrollEnabled={true}
      />
    </View>
  );
};

interface JobCardsProps {
  admitCards: AdmitCard[];
  results: Result[];
  loading?: boolean;
}

const JobCardsSection = ({ admitCards, results, loading }: JobCardsProps) => {
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="p-4 bg-gray-50 flex-1">
      <View className="h-[50vh]">
        <CardsSection title="Admit Cards" data={admitCards} />
      </View>
      <View className="h-[50vh] my-5 pt-2">
        <CardsSection title="Results" data={results} />
      </View>
    </View>
  );
};

export default JobCardsSection;
