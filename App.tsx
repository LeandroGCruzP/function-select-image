import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// expo install expo-image-picker
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

interface StatePreview {
  active: number;
}

export default function App() {
  const [images, setImages] = useState<string[]>([]);
  const [statePreview, setStatePreview] = useState<StatePreview>();

  async function handleSelectImages() {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();

    if (status !== "granted") {
      alert("Ops, necesitamos de acceso a tus fotos...");
      return;
    }

    // Open Camera
    // const result = await ImagePicker.launchCameraAsync({
    // Open Gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.cancelled) {
      return;
    }

    const { uri: image } = result;

    setImages([...images, image]);
  }

  async function handleChangeImageView({ nativeEvent }) {
    const slide = await Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width - 0.1
    );

    if (slide !== -1) {
      setStatePreview({ active: slide });
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.previewImagesContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          onScroll={handleChangeImageView}
          showsHorizontalScrollIndicator={false}
        >
          {images.map((image) => {
            return (
              <Image
                key={image}
                source={{ uri: image }}
                style={styles.previewImages}
              />
            );
          })}
        </ScrollView>

        <View style={styles.dotOnImage}>
          {images.map((i, n) => (
            <Text
              key={n}
              style={
                n == statePreview?.active
                  ? styles.dotActive
                  : styles.dotInnative
              }
            >
              ●
            </Text>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.imagesInput} onPress={handleSelectImages}>
        <Feather name="plus" size={24} color="#15B6D6" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
  },

  previewImagesContainer: {
    width,
    height: height * 0.35,
  },

  previewImagescrollView: {
    width,
    height,
  },

  previewImages: {
    width,
    resizeMode: "cover",
  },

  dotOnImage: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },

  dotInnative: {
    fontSize: width / 50,
    color: "#888",
    margin: 3,
  },

  dotActive: {
    fontSize: width / 50,
    color: "#fff",
    margin: 3,
  },

  imagesInput: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderStyle: "dashed",
    borderColor: "#96D2F0",
    borderWidth: 1.4,
    borderRadius: 20,
    height: 56,
    width,
    margin: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
