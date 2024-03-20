import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import {BleManager} from 'react-native-ble-plx';

const BleSample = () => {
  const [deviceList, setDeviceList] = useState([]);
  const manager = new BleManager();

  useEffect(() => {
    const scanAndConnect = async () => {
      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error(error);
          return;
        }
        if (!deviceList.find(d => d.id === device.id)) {
          setDeviceList(prevDevices => [...prevDevices, device]);
        }
      });
    };

    scanAndConnect();

    // Clean up on unmount
    return () => {
      manager.stopDeviceScan();
    };
  }, []);

  const connectToDevice = async deviceId => {
    try {
      const connectedDevice = await manager.connectToDevice(deviceId);
      console.log('Connected to device:', connectedDevice.id);
      // Now you can interact with the connected device
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Available Devices:</Text>
      {deviceList.map(device => (
        <Button
          key={device.id}
          title={device.name || 'Unnamed Device'}
          onPress={() => connectToDevice(device.id)}
        />
      ))}
    </View>
  );
};

export default BleSample;
