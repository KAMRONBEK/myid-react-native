import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  NativeModules,
  NativeEventEmitter,
  Image,
  StyleSheet,
} from 'react-native';

const {MyIdModule} = NativeModules;

type SuccessEvent = {
  code: string;
  comparison: number;
  image: string;
};

type ErrorEvent = {
  message: string;
  code: number;
};

const clientId = 'emit_sdk-pEXr5TMHOHYL5QcP2JjObte94zS0vPpLnjbqTigm"';
const clientHash = 'f79e7195-cf94-4bdd-9115-6c08033e191c';
const clientHashId =
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwgGX9AQqActMnsW5K++GXYYCynxB/RQVMRSBsYCjSEmIrKaV8InLDxoG+WE2AY7lGyoo9qkxzKg1Vk6tW8pBW5PpNSH6xN1P9ufEnHQWuXCpdT+UkAoVMGnoYQ6glp9mZVlPEottslt6THAGa9wf3fMku97UdsuSctOeGXDr3LnsCFB7ZmaracTQFQ41v6SMbGZX2NsIKVtlJMZqAle9sI3crk9RGRg7Os8f1NolNNFuWQEjx/DpaSjCHGMMscWkSX7GEqJiVSNybGquHe1vjtswoT3oO2Mr+uCfz6Owx/d0/0Q8YWxvhorxbGT0CEw1m0CU+JbWh2lrgf1jHvBULQIDAQAB';
const passportData = 'passport-number';
const dateOfBirth = '1990-01-01'; // Ensure the date format matches what your SDK expects
const buildMode = 'PRODUCTION'; // or "DEBUG", depending on your environment

const App = () => {
  const [imageBase64, setImageBase64] = useState('');

  useEffect(() => {
    if (MyIdModule) {
      const myidEvents = new NativeEventEmitter(MyIdModule);

      const onSuccess = (event: SuccessEvent) => {
        console.log('onSuccess received', event.code, event.comparison);
        // Clipboard.setString(event.image);
        setImageBase64(event.image);
      };
      const onError = (event: ErrorEvent) =>
        console.log('onError received', event);
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
