import React, {useEffect} from 'react';
import {View, Button, NativeModules, NativeEventEmitter} from 'react-native';

const {MyIdModule} = NativeModules;

const App = () => {
  useEffect(() => {
    if (MyIdModule) {
      const myidEvents = new NativeEventEmitter(MyIdModule);

      const onSuccess = (event: any) =>
        console.log('onSuccess received', event);
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
      MyIdModule.startMyId();
    } else {
      console.log('Module is not available');
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button title="Start MyID" color="#841584" onPress={startSdk} />
    </View>
  );
};

export default App;
