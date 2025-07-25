import { urlFor } from "@/lib/sanity/client";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  View,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Slider({ data }) {
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % data.length;
      scrollToIndex(nextIndex);
    }, 3000); // change slide every 3 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [activeIndex]);

  return (
    <View className="justify-center items-center mt-6">
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View
            style={{ width: width * 0.9 }}
            className="my-auto justify-center items-center px-4"
          >
            <View className="w-full rounded-xl overflow-hidden bg-white shadow">
              {item.image && (
                <Image
                  source={{ uri: urlFor(item.image).url() }}
                  className="flex-1 h-20 w-full justify-center items-center"
                  resizeMode="cover"
                />
              )}
              {item.title && (
                <Text className="py-2 px-3 text-center font-bold text-red-400">
                  {item.title}
                </Text>
              )}
            </View>
          </View>
        )}
      />

      {/* Dots */}
      <View className="flex-row justify-center mt-3 gap-1 space-x-2">
        {data.map((_, index) => (
          <View
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === activeIndex ? "bg-black" : "bg-gray-400"
            }`}
          />
        ))}
      </View>
    </View>
  );
}
