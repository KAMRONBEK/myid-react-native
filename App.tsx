import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  NativeModules,
  NativeEventEmitter,
  Image,
  StyleSheet,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';

const {MyIdModule} = NativeModules;

const clientId = 'your-client-id';
const clientHash = 'your-client-hash';
const clientHashId = 'your-client-hash-id';
const passportData = 'passport-number';
const dateOfBirth = '1990-01-01'; // Ensure the date format matches what your SDK expects
const buildMode = 'PRODUCTION'; // or "DEBUG", depending on your environment

const App = () => {
  const [imageBase64, setImageBase64] = useState('');

  useEffect(() => {
    if (MyIdModule) {
      const myidEvents = new NativeEventEmitter(MyIdModule);

      const onSuccess = (event: any) => {
        console.log('onSuccess received', event.code, event.comparison);
        // Clipboard.setString(event.image);
        setImageBase64(event.image);
      };
      const onError = (event: any) => console.log('onError received', event);
      const onUserExited = (event: any) =>
        console.log('onUserExited received', event);

      myidEvents.addListener('onSuccess', onSuccess);
      myidEvents.addListener('onError', onError);
      myidEvents.addListener('onUserExited', onUserExited);

      return () => {
        myidEvents.removeAllListeners('onSuccess');
        myidEvents.removeAllListeners('onError');
        myidEvents.removeAllListeners('onUserExited');
      };
    }
  }, []);

  const startSdk = () => {
    if (MyIdModule) {
      console.log('Calling startMyId');
      MyIdModule.startMyId(
        clientId,
        clientHash,
        clientHashId,
        passportData,
        dateOfBirth,
        buildMode,
      );
      console.log('Called startMyId');
    } else {
      console.log('Module is not available');
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {imageBase64 ? (
        <Image
          style={styles.image}
          source={{uri: `data:image/jpeg;base64,${imageBase64}`}}
        />
      ) : null}
      <Button title="Start MyID" color="#841584" onPress={startSdk} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});
