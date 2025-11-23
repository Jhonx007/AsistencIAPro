import { View, Text, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef } from "react";

import { slides } from "../../constants/onboarding";

const { width } = Dimensions.get("window");

export default function Onboarding() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleContinue = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace("/(auth)/login");
    }
  };

  const handleSkip = () => {
    router.replace("/(auth)/login");
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <SafeAreaView className="flex-1 bg-[#0f172a]">
      <StatusBar style="light" />

      {/* Header: Skip Button */}
      <View className="w-full flex-row justify-end px-6 py-4">
        <TouchableOpacity onPress={handleSkip}>
          <Text className="text-gray-400 text-base font-medium">Omitir</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={{ width }} className="items-center justify-center px-6">
            {/* Icon/Image Placeholder */}
            <View className="w-64 h-64 items-center justify-center bg-emerald-900/20 rounded-full mb-12">
              <MaterialCommunityIcons
                name={item.icon as any}
                size={120}
                color="#a7f3d0"
              />
            </View>

            {/* Text Content */}
            <View className="items-center space-y-4">
              <Text className="text-white text-3xl font-bold text-center leading-tight">
                {item.title}
              </Text>

              <Text className="text-gray-300 mt-5 text-center text-base leading-6 px-4">
                {item.description}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Footer: Dots & Button */}
      <View className="w-full items-center px-6 pb-12 pt-4">
        {/* Pagination Dots */}
        <View className="flex-row space-x-2 mb-10">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`w-2.5 h-2.5 m-2 rounded-full ${
                currentIndex === index ? "bg-blue-500" : "bg-gray-600"
              }`}
            />
          ))}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          className="w-full bg-blue-600 py-4 rounded-xl items-center active:bg-blue-700"
        >
          <Text className="text-white text-lg font-bold">
            {currentIndex === slides.length - 1 ? "Comenzar" : "Continuar"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
