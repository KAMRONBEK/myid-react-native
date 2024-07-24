import React, {useEffect} from 'react';
import {View, Button, NativeModules, NativeEventEmitter} from 'react-native';

const {MyIdModule} = NativeModules;

const App = () => {
  useEffect(() => {
    if (MyIdModule) {
      const myidEvents = new NativeEventEmitter(MyIdModule);

      const onSuccess = () => console.log('onSuccess received');
      const onError = (event: any) => console.log('onError received', event);
      const onUserExited = () => console.log('onUserExited received');

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
