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
  ActivityIndicator,
  FlatList,
} from "react-native";

import * as SecureStore from "expo-secure-store";
import * as ImageManipulator from "expo-image-manipulator";

import { Text, View } from "../../components/Themed";

import { LoginContext } from "../../contexts/LoginContext";
import { RootScreens } from "../../navigation";
import { RootStackParamList } from "../../types";

const available = false;

export type PalmParams = {
  isLog: boolean;
  data?: {
    firstName: string;
    lastName: string;
  };
};

interface Props {
  route: { params: PalmParams };
  navigation: StackNavigationProp<RootStackParamList, RootScreens.CapturePalm>;
}

export default function CapturePalm({ navigation, route }: Props) {
  const { authToken, setAuthToken, userName, setLoggedIn } =
    useContext(LoginContext);
  const [isLoading, setIsLoading] = useState(false);
  const { isLog, data } = route.params;
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [preview, setPreview] = useState<boolean>(false);
  const [photoArr, setPhotoArr] = useState<CameraCapturedPicture[]>([]);
  let camera: Camera;
  const [photo, setPhoto] = useState<any>();
  const onLogin = async () => {
    if (photo && !authToken) {
      const response = await fetch(
        "https://cisc4003.icac.tech/api/Auth/login",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userName,
            palmprint: photo.base64,
          }),
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        alert("Invalid palm print or username");
        return;
      }
      const ret = await response.json();
      await SecureStore.setItemAsync("token", ret.data!.Token);
      await SecureStore.setItemAsync("loginDate", Date.now().toString());
      await SecureStore.setItemAsync("loggedIn", "YES");
      setIsLoading(false);
      setAuthToken(ret.data!.Token);
      setLoggedIn(true);
    }
  };

  const onRegister = async () => {
    if (available && photoArr && !authToken) {
      alert("Service not availble yet");
      const palmprints = photoArr.map((pic) => pic.base64);
      const body = {
        username: userName,
        palmprints,
        firstname: data?.firstName,
        lastname: data?.lastName,
      };
      const response = await fetch(
        "https://cisc4003.icac.tech/api/Auth/register",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",

            body: JSON.stringify(body),
          },
        }
      );
      const ret = await response.json();
      if (!response.ok) {
        alert("Invalid palm print or username");
        console.log(ret!.data.message);
        return;
      }
      console.log(ret.data!.Token);
      await SecureStore.setItemAsync("token", ret.data!.Token);
      await SecureStore.setItemAsync("loginDate", Date.now().toString());
      await SecureStore.setItemAsync("loggedIn", "YES");
      setIsLoading(false);
      setAuthToken(ret.data!.Token);
      setLoggedIn(true);
    }
    alert("Service Not Available");
    navigation.navigate("Login");
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const snap = async () => {
    const pic = await camera.takePictureAsync({ base64: true });
    if (!isLog) {
      alert(`Photo ${photoArr!.length + 1} taken`);
      const compressed = await ImageManipulator.manipulateAsync(pic.uri, [], {
        compress: 0.7,
        base64: true,
        format: ImageManipulator.SaveFormat.JPEG,
      });
      const newArr = [...photoArr!, compressed];
      setPhotoArr(newArr);
      if (newArr.length === 9) {
        setPreview(true);
      }
    } else {
      setPhoto(pic);
      setPreview(true);
    }
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
      ) : preview && !isLog ? (
        <>
          <FlatList
            data={photoArr}
            renderItem={({ item }) => (
              <View style={styles.imageContainerStyle}>
                <Image
                  style={styles.imageStyle}
                  source={{
                    uri: item.uri,
                  }}
                />
              </View>
            )}
            //Setting the number of column
            numColumns={3}
            keyExtractor={(_, index) => index.toString()}
          />
          <TouchableOpacity
            style={styles.blueButton}
            onPress={() => {
              if (isLog) onLogin();
              else onRegister();
            }}
          >
            <Text style={styles.text}>NEXT</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.camera}>
          <Image source={{ uri: photo!.uri }} style={{ flex: 1 }} />
          <TouchableOpacity
            style={styles.blueButton}
            onPress={() => {
              if (isLog) onLogin();
              else onRegister();
            }}
          >
            <Text style={styles.text}>NEXT</Text>
          </TouchableOpacity>
        </View>
      )}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    bottom: 0,
    height: "100%",
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 9999,
  },
  container: {
    position: "relative",
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
  imageContainerStyle: {
    flex: 1,
    flexDirection: "column",
    margin: 1,
  },
  imageStyle: {
    height: 120,
    width: "100%",
  },
});
