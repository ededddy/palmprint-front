import { StackNavigationProp } from "@react-navigation/stack";
import { Camera, CameraCapturedPicture } from "expo-camera";
import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Platform,
  PlatformColor,
  Button,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ImageBackground,
} from "react-native";

import { Text, View } from "../../components/Themed";

import { LoginContext } from "../../contexts/LoginContext";
import { RootScreens } from "../../navigation";
import { RootStackParamList } from "../../types";

export type PalmParams = {
  isLog: boolean;
};

interface Props {
  route: { params: PalmParams };
  navigation: StackNavigationProp<RootStackParamList, RootScreens.CapturePalm>;
}

export default function CapturePalm({ navigation, route }: Props) {
  const { setLoggedIn } = useContext(LoginContext);
  const { isLog } = route.params;
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [preview, setPreview] = useState<boolean>(false);
  let camera: Camera;
  const [photo, setPhoto] = useState<any>();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const snap = async () => {
    setPhoto(await camera.takePictureAsync());
    setPreview(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.row}>
        <Button
          title="Cancel"
          accessibilityLabel="Click to go back"
          onPress={() => {
            if (!preview) {
              navigation.goBack();
            } else {
              setPreview(false);
              setPhoto(null);
            }
          }}
        />
        {!preview && <Text style={styles.title}>Capture your Palm Print</Text>}
        {preview && <Text style={styles.title}>Preview</Text>}
      </SafeAreaView>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {hasPermission === null ? (
        <View />
      ) : hasPermission === false ? (
        <Text> NO access to camera</Text>
      ) : !preview ? (
        <>
          <Camera style={styles.camera} type={type} ref={(r) => (camera = r!)}>
            <Image
              style={styles.overlay}
              source={require("../../assets/images/hand.png")}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              >
                <Text style={styles.text}>Flip</Text>
              </TouchableOpacity>
            </View>
          </Camera>
          <TouchableOpacity style={styles.blueButton} onPress={snap}>
            <Text style={styles.text}>SNAP</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.camera}>
          <Image source={{ uri: photo!.uri }} style={{ flex: 1 }} />
          <TouchableOpacity
            style={styles.blueButton}
            onPress={() => setLoggedIn(true)}
          >
            <Text style={styles.text}>NEXT</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    ...Platform.select({
      ios: { backgroundColor: PlatformColor("systemBackground") },
      default: {
        backgroundColor: "#000000ff",
      },
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 15,
    height: 3,
    width: "100%",
  },
  camera: {
    flex: 1,
    position: "relative",
  },
  buttonContainer: {
    position: "absolute",
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
    bottom: 0,
  },
  button: {
    paddingHorizontal: 30,
    backgroundColor: "rgba(0,0,0, 0.2)",
    paddingVertical: 10,
    borderRadius: 10,
  },
  blueButton: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: "#1976d2",
  },
  text: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
  row: {
    display: "flex",
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  overlay: {
    height: "100%",
    width: "100%",
  },
});
