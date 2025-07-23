import * as React from "react";
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
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (!emailAddress || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    console.log(emailAddress, password);

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    if (!code) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    setIsLoading(true);
    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 px-6">
            <View className="flex-1 justify-center">
              {/* Logo/Branding */}
              <View className="items-center mb-8">
                <View className="w-20 h-20 items-center justify-center rounded-2xl  bg-gradient-to-br from-blue-600 to-purple-600">
                  <Ionicons name="mail" size={40} color={"white"} />
                </View>
                <Text className="text-3xl font-bold text-gray-900 mb-2">
                  Check Your Email
                </Text>
                <Text className="text-lg text-gray-900 text-center">
                  We've sent a verification code to {"\n"}
                  {emailAddress}
                </Text>
              </View>

              {/* Verification Form */}

              <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Enter Verification Code
                </Text>

                {/* Email Input */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </Text>
                  <View className="flex-row items-center rounded-xl px-4 py-1 bg-gray-50 border border-gray-50">
                    <Ionicons name="key-outline" size={20} color={"#6B72B0"} />
                    <TextInput
                      placeholder="Enter 6-digit code"
                      placeholderTextColor={"#9CA3AF"}
                      autoCapitalize="none"
                      value={code}
                      className="flex-1 ml-3 text-center text-lg text-gray-900 tracking-widest"
                      onChangeText={setCode}
                      keyboardType="number-pad"
                      maxLength={6}
                      editable={!isLoading}
                    />
                  </View>
                </View>

                {/* Verify Buttons */}
                <TouchableOpacity
                  onPress={onVerifyPress}
                  disabled={isLoading}
                  className={`rounded-xl py-4 shadow-sm mb-4 ${
                    isLoading ? "bg-gray-400" : "bg-green-600"
                  }`}
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-center justify-center">
                    {isLoading ? (
                      <Ionicons name="refresh" size={20} color={"white"} />
                    ) : (
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={20}
                        color={"white"}
                      />
                    )}
                    <Text className="text-white font-semibold text-lg ml-2">
                      {isLoading ? "Verifying..." : "Verify Email"}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Resend Code */}
                <TouchableOpacity className="py-2">
                  <Text className="text-blue-600 font-medium text-center">
                    Don't receive the code? Resend
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View className="pb-6 mb-4">
              <Text className="text-center text-gray-500 text-sm">
                Almost there! Just one more step
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6">
          {/* Main */}

          <View className="flex-1 justify-center">
            {/* Branding/Logo */}
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

            {/* SignIn Form */}
            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Create an Account
              </Text>

              {/* Email Input */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Email
                </Text>
                <View className="flex-row items-center rounded-xl px-4 py-1 bg-gray-50 border border-gray-50">
                  <Ionicons name="mail-outline" size={20} color={"#6B72B0"} />
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor={"#9CA3AF"}
                    autoCapitalize="none"
                    value={emailAddress}
                    className="flex-1 ml-3 text-gray-900"
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
                <View className="flex-row items-center rounded-xl px-4 py-1 bg-gray-50 border border-gray-50">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={"#6B72B0"}
                  />
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor={"#9CA3AF"}
                    secureTextEntry={true}
                    value={password}
                    className="flex-1 ml-3 text-gray-900"
                    onChangeText={setPassword}
                    editable={!isLoading}
                  />
                </View>
                <Text className="text-xs text-gray-500 mt-1">
                  Must be atleast 8 characters
                </Text>
              </View>

              {/* SignIn Buttons */}
              <TouchableOpacity
                onPress={onSignUpPress}
                disabled={isLoading}
                className={`rounded-xl py-4 shadow-sm mb-4 ${
                  isLoading ? "bg-gray-400" : "bg-blue-600"
                }`}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center justify-center">
                  {isLoading ? (
                    <Ionicons name="refresh" size={20} color={"white"} />
                  ) : (
                    <Ionicons
                      name="person-add-outline"
                      size={20}
                      color={"white"}
                    />
                  )}
                  <Text className="text-white font-semibold text-lg ml-2">
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Terms */}
              <Text className="text-sm text-gray-500  text-center mb-4">
                By signng up, you agree to our Terms of Service and Privacy
                Policy
              </Text>
            </View>

            {/* Sign IN Links */}

            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-gray-600">Already have an account?</Text>

              <TouchableOpacity>
                <Text
                  className="text-blue-600 font-semibold"
                  onPress={() => router.replace("/sign-in")}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="pb-6 mb-4">
              <Text className="text-sm text-center text-gray-500">
                search latest jobs with simple and clean interface
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
