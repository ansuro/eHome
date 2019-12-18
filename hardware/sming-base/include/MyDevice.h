#pragma once

#include <SmingCore.h>
#include <ArduinoJson6.h>

class MyDevice
{
private:
    String states;

    // state-specific variables
    bool mState1 = false;
    bool mState2 = false;
    bool mState3 = false;

public:
    MyDevice();
    ~MyDevice();

    String getDeviceStates();
    String handleStateChange(const String &stateName, const String &value);
};
