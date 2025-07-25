import { supportData } from "@/lib/utils";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";

export default function SupportMe() {
  const [showPayment, setShowPayment] = useState(false);

  const handleSupportPress = () => {
    setShowPayment(!showPayment);
  };

  const openScanner = () => {
    Linking.openURL(supportData.payment_list.upi_scanner);
  };

  return (
    <View className="bg-white rounded-2xl p-5 shadow-lg mx-4">
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
        className="bg-red-500 rounded-2xl py-3 px-6 items-center mb-4"
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

          <View className="flex flex-col items-center justify-center">
            {/* QR Code */}
            <TouchableOpacity onPress={openScanner} className="m-auto">
              <Image
                source={{
                  uri: "https://4o9e8g1e7a.ufs.sh/f/pzDgHaSuOztfF1tQKx75KXJTyS18GvPozabufI4VhCl2eMYO",
                }}
                className="w-[250px] h-[250px] rounded-lg border border-gray-300"
                resizeMode="contain"
              />
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
                <MaterialIcons name="payment" size={20} color="white" />
                <Text className="text-white font-medium ml-2">Pay via UPI</Text>
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
