// screens/VideoCallScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const VideoCallScreen = ({ route }) => {
  const { type, roomId } = route.params;

  let videoURL = '';

  switch (type) {
    case 'jitsi':
      videoURL = `https://meet.jit.si/${roomId}`;
      break;
    case 'daily':
      videoURL = `https://your-subdomain.daily.co/${roomId}`;
      break;
    case 'zoom':
      videoURL = `https://zoom.us/j/${roomId}`;
      break;
    default:
      videoURL = 'https://meet.jit.si/defaultRoom';
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: videoURL }}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
};

export default VideoCallScreen;
