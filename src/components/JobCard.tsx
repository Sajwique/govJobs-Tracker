import { View, Text, TouchableOpacity, Image } from "react-native";
import { urlFor } from "@/lib/sanity/client";
import { Ionicons } from "@expo/vector-icons";
import { Job } from "@/lib/sanity/sanity.types";

interface ExerciseCardProps {
  item: Job;
  isHorizontal?: boolean;
  onPress: () => void;
  showChevron?: boolean;
}

const JobCard = ({
  item,
  onPress,
  showChevron,
  isHorizontal,
}: ExerciseCardProps) => {
  return (
    <TouchableOpacity
      className={`bg-white rounded-2xl mb-4 shadow-sm border border-gray-100 ${
        isHorizontal && "w-[300px]"
      }`}
      onPress={onPress}
    >
      <View className="flex-row p-6">
        <View className="w-20 h-20 bg-white rounded-xl mr-4 overflow-hidden">
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
            <Text className="font-bold text-md text-gray-900 mb-1">
              {item.title}
            </Text>
            <View className="flex-row py-1 px-3 items-center rounded-full text-sm bg-red-500">
              <Text className="text-white">Last Date : </Text>
              <Text className=" text-white ">
                {item.importantDates.applyEnd
                  ? item.importantDates.applyEnd
                  : "Notify Soon"}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <View
              className={`flex-row items-center justify-between px-3 py-1 mt-1 bg-gray-600 rounded-full `}
            >
              <Text className="text-sm font-semibold text-white">
                Max. Age :
              </Text>
              <Text className="text-sm font-semibold text-white">
                {" " + item.eligibility.ageMax + " " + "years"}
              </Text>
            </View>

            {showChevron && (
              <TouchableOpacity className="p-2">
                <Ionicons name="chevron-forward" size={20} color={"6B7280"} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default JobCard;
