#pragma once

#include <SmingCore.h>
// #include <ArduinoJson6.h>
#include "BuiltinLed.h"
#include "DeviceStates.h"

class MyDevice
{
private:
    DeviceStates deviceStates;
    void defineStates();

public:
    MyDevice() = default;
    ~MyDevice() = default;

    String getDeviceStates();
    String handleStateChange(const String &stateName, const String &value);
    void boot(MqttClient *mClient);
    
    BuiltinLed BLed;
};
