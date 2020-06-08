import { /*Permissions,*/ Notifications } from "expo";
import * as Permissions from "expo-permissions"; // SDK 34
import { AsyncStorage } from "react-native";

export async function setupPushNotifications() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== "granted") {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== "granted") return;

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();
  await AsyncStorage.setItem("push.token", token);

  //console.log("Notification token: ", token);
}

export async function disposePushnotifications() {
  await AsyncStorage.removeItem("push.token");
}
