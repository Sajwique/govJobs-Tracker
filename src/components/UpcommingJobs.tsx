import { View, Text, TouchableOpacity, Image } from "react-native";
import { urlFor } from "@/lib/sanity/client";
import { Ionicons } from "@expo/vector-icons";
import { Job } from "@/lib/sanity/sanity.types";
import { useRouter } from "expo-router";

interface ExerciseCardProps {
  item: Job;
  isHorizontal?: boolean;
  onPress: () => void;
  showChevron?: boolean;
}

export const UpcommingJobCard = ({
  item,
  onPress,
  showChevron,
  isHorizontal,
}: ExerciseCardProps) => {
  return (
    <View className="h-24">
      <TouchableOpacity
        className="relative bg-white rounded-2xl mb-4 shadow-sm border border-gray-100 w-[300px]"
        onPress={onPress}
      >
        {item.isUpcomming === true && (
          <View className="flex items-center justify-center bg-blue-500 rounded-full absolute -top-2 right-0 px-2">
            <Text className="text-center font-semibold text-white text-sm">
              {item.isUpcomming ? "Upcomming" : ""}
            </Text>
          </View>
        )}
        <View className="flex-row p-3">
          <View className="w-14 h-14 bg-white rounded-xl mr-4 overflow-hidden">
            {item.image ? (
              <Image
                source={{ uri: urlFor(item.image?.asset?._ref).url() }}
                className="w-full h-full"
                resizeMode="contain"
              />
            ) : (
              <View className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 items-center justify-center">
                <Ionicons name="fitness" size={24} color={"white"} />
              </View>
            )}
          </View>

          <View className="flex-1 justify-normal">
            <View>
              <Text className="font-bold text-sm text-gray-900 mb-1">
                {item.title}
              </Text>
              <View className="flex-row  items-center justify-between gap-1 rounded-full ">
                <View className="flex-row py-1 px-3 items-center rounded-full bg-red-400">
                  <Text className="text-white text-xs">Total Post : </Text>
                  <Text className=" text-white text-xs">
                    {item.vacancyTotal || "0"}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between px-3 py-1 bg-gray-500 rounded-full">
                  <Text className="text-xs font-semibold text-white">
                    Max. Age :
                  </Text>
                  <Text className="text-xs font-semibold text-white">
                    {" " + item.eligibility.ageMax + " " + "years"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
