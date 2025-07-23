import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import GoogleSignIn from "@/components/GoogleSignIn";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    if (!emailAddress || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1  px-6">
          {/* Header Sections */}

          <View className="flex-1 justify-center mt-5">
            {/* Loog Branding */}
            <View className="items-center mb-8">
              <View className="w-20 h-20 items-center justify-center rounded-2xl  bg-gradient-to-br from-blue-600 to-purple-600">
                <Image
                  source={{
                    uri: "https://4o9e8g1e7a.ufs.sh/f/pzDgHaSuOztfmRMKmsq0lSX14qw7YjWvrJ35O2ReZMDtPCkx",
                  }}
                  className="w-20 h-20 rounded-full"
                />
              </View>
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                govJobs Tracker
              </Text>
              <Text className="text-lg text-gray-900 text-center">
                Track your goverment job journey {"\n"} add reach your goals
              </Text>
            </View>

            {/* Sign-in form */}
            <View className="bg-white rounded-2xl p-6 shadow-sm border-gray-100 mb-6">
              <Text className="text-2xl font-bold text-center text-gray-900 mb-6">
                Welcome Back
              </Text>

              {/* Email Input */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Email
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-1 border border-gray-200">
                  <Ionicons name="mail-outline" size={20} color={"#6B7280"} />
                  <TextInput
                    className="flex-1 ml-3 text-gray-900"
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter your email"
                    placeholderTextColor={"#9CA3AF"}
                    onChangeText={setEmailAddress}
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Password Input */}

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Password
                </Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-1 border border-gray-200">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={"#6B7280"}
                  />
                  <TextInput
                    value={password}
                    placeholder="Enter your password"
                    placeholderTextColor={"#9CA3AF"}
                    secureTextEntry={true}
                    className="flex-1 ml-3 text-gray-900"
                    onChangeText={setPassword}
                    editable={!isLoading}
                  />
                </View>
              </View>
            </View>

            {/* Sign-in buttons */}
            <TouchableOpacity
              onPress={onSignInPress}
              disabled={isLoading}
              className={`rounded-xl py-4 shadow-sm mb-4 ${
                isLoading ? "bg-gray-400" : "bg-blue-400"
              }`}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-center">
                {isLoading ? (
                  <Ionicons name="refresh" size={20} color={"white"} />
                ) : (
                  <Ionicons name="log-in-outline" size={20} color={"white"} />
                )}
                <Text className="text-white font-semibold text-lg ml-2">
                  {isLoading ? "Signing In..." : "Sign In"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="px-4 text-gray-500 text-sm"> or</Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            {/* Google SignIn Buttons */}
            <GoogleSignIn />

            {/* Sign Up Link */}
            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-gray-600">Don't have an account?</Text>

              <TouchableOpacity>
                <Text
                  className="text-blue-600 font-semibold"
                  onPress={() => router.replace("/sign-up")}
                >
                  {" "}
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer sections */}
            <View className="pb-6 mb-4">
              <Text className="text-center text-gray-500 text-sm">
                search latest jobs with simple and clean interface
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
