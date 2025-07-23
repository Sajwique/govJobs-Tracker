import { supportData } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
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

export default function SupportMe() {
  const [showPayment, setShowPayment] = useState(false);

  const handleSupportPress = () => {
    setShowPayment(!showPayment);
  };

  const openScanner = () => {
    Linking.openURL(supportData.payment_list.upi_scanner);
  };

  return (
    <View className="bg-white rounded-2xl p-5 shadow-lg mx-4 my-4">
      <View className="flex-row items-center mb-4">
        <Ionicons name="heart-circle-outline" size={24} color="#e53e3e" />
        <Text className="text-xl font-bold text-red-600 ml-2">
          {supportData.main_title}
        </Text>
      </View>

      {/* Beta Notice */}
      <Text className="text-lg font-semibold text-gray-800 mb-1">
        {supportData.title}
      </Text>
      <Text className="text-gray-600 mb-4">{supportData.description}</Text>

      {/* Support Appeal */}
      <Text className="text-gray-700 mb-6 leading-relaxed">
        {supportData.help}
      </Text>

      {/* Support Button */}
      <TouchableOpacity
        className="bg-red-500 rounded-full py-3 px-6 items-center mb-4"
        onPress={handleSupportPress}
      >
        <Text className="text-white font-bold text-lg">
          {showPayment ? "Hide Payment Options" : "Support Us"}
        </Text>
      </TouchableOpacity>

      {/* Payment Options - Visible only when toggled */}
      {showPayment && (
        <View className="border-t border-gray-200 pt-4">
          <Text className="text-center text-gray-700 font-medium mb-4">
            Scan QR or use UPI ID:
          </Text>

          <View className="flex-row justify-center items-start">
            {/* QR Code */}
            <TouchableOpacity onPress={openScanner} className="mr-6">
              <Image
                source={require("../../assets/images/icon.png")}
                className="w-32 h-32 rounded-lg border border-gray-300"
                resizeMode="contain"
              />
              <Text className="text-center mt-2 text-blue-500">
                Tap to enlarge
              </Text>
            </TouchableOpacity>

            {/* UPI Details */}
            <View className="mt-2">
              <View className="bg-gray-100 p-3 rounded-lg mb-3">
                <Text className="text-center font-mono text-lg">
                  {supportData.payment_list.upi_id}
                </Text>
              </View>
              <TouchableOpacity
                className="flex-row items-center justify-center bg-green-600 py-2 px-4 rounded-lg"
                onPress={() => {
                  /* Implement UPI payment deep link */
                  Linking.openURL(
                    `upi://pay?pa=${supportData.payment_list.upi_id}`
                  );
                }}
              >
                <Ionicons name="logo-whatsapp" size={20} color="white" />
                <Text className="text-white font-medium ml-2">
                  Pay via UPI Apps
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-center text-gray-500 mt-4 italic">
            Every contribution helps us improve and add new features!
          </Text>
        </View>
      )}
    </View>
  );
}
