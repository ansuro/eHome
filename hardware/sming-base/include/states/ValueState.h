#pragma once

#include <SmingCore.h>
#include <ArduinoJson6.h>

#include "ehome_types.h"

class ValueState
{
private:
    const String DEVICE_ID = WifiStation.getMAC(':');
    Delegate<String(void)> cb;
    String curValue;
    Timer pTimer;
    String name;
    MqttClient *mqttClient;

public:
    ValueState() = default;
    ValueState(const String &name, uint32_t refreshTimeInMs, const Delegate<String(void)> cb, MqttClient *mqttClient);
    ~ValueState() = default;

    String getName() { return this->name; }
    String getValue() { return this->curValue; }

    void handleTimer();
};
