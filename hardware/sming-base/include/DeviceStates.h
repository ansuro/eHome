#pragma once

#include <SmingCore.h>
// #include <ArduinoJson6.h>

#include "states/StateTypes.h"
#include "states/ValueState.h"
#include "states/OnOffState.h"
#include "states/OnOffOptionsState.h"

class DeviceStates
{
private:
    HashMap<String, OnOffState*> mOnOffStates;
    HashMap<String, OnOffOptionsState*> mOnOffOptionsStates;
    HashMap<String, ValueState*> mValueStates;

    MqttClient *mqttClient;

public:
    DeviceStates();
    ~DeviceStates();

    void addOnOffState(const String &name, Delegate<bool(const bool, const bool)> cb);
    void addOnOffOptionsState(const String &name, Vector<String> *options, Delegate<String(const String &, const String &)> cb);
    void addValueOnlyState(const String &name, uint32_t refreshTimeInMs, Delegate<String(void)> cb);

    String handleStateChange(const String &stateName, const String &value);
    String getStatesAsJsonString();

    void setMqtt(MqttClient *mClient);
};
