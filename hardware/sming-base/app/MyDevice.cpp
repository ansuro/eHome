#include "MyDevice.h"

// TODO refactor

// StateTypes
//     Switch = 0,
//     SwitchWithOptions = 1,
//     ValueOnly = 2

/*
    Switch, On/Off { name, value, type = 0 }
    ValueOnly { name, value, type = 2 }

    SwitchWithOptions { name, value, optionslist, type = 1 }

*/ 

MyDevice::MyDevice()
{
}

MyDevice::~MyDevice()
{
}

// implement your states
String MyDevice::handleStateChange(const String &stateName, const String &value)
{
    // TODO refactor

    if (stateName == "Plug 1")
    {
        // String msg;
        mState1 = !mState1;
        debugf("Plug 1, new state: %u", mState1);
        // JsonObject state1 = j.to<JsonObject>();
        // state1["name"] = stateName;
        // state1["type"] = 0;
        // state1["value"] = mState1 ? "true" : "false";
        // serializeJson(j, msg);
        // return msg;
        return getDeviceStates();
    }
    else if (stateName == "Plug 2")
    {
        // String msg;
        mState2 = !mState2;
        debugf("Plug 2, new state: %u", mState2);
        // JsonObject state1 = j.to<JsonObject>();
        // state1["name"] = stateName;
        // state1["type"] = 0;
        // state1["value"] = mState2 ? "true" : "false";
        // serializeJson(j, msg);
        // return msg;
        return getDeviceStates();
    }
    else if (stateName == "Plug 3")
    {
        // String msg;
        mState3 = !mState3;
        debugf("Plug 3, new state: %u", mState3);
        // JsonObject state1 = j.to<JsonObject>();
        // state1["name"] = stateName;
        // state1["type"] = 0;
        // state1["value"] = mState3 ? "true" : "false";
        // serializeJson(j, msg);
        // return msg;
        return getDeviceStates();
    }

    Serial.printf("Unknown state: %s\n", stateName.c_str());

    // TODO create error state and react accordingly in backend -> frontend
    String e = "Error";
    return e;
}

String MyDevice::getDeviceStates()
{
    StaticJsonDocument<256> s;
    JsonArray array = s.to<JsonArray>();

    // define your states
    JsonObject state1 = array.createNestedObject();
    state1["name"] = "Plug 1";
    state1["type"] = 0;
    state1["value"] = mState1;

    JsonObject state2 = array.createNestedObject();
    state2["name"] = "Plug 2";
    state2["type"] = 0;
    state2["value"] = mState2;

    JsonObject state3 = array.createNestedObject();
    state3["name"] = "Plug 3";
    state3["type"] = 0;
    state3["value"] = mState3;

    states = "";
    serializeJson(array, states);
    debugf("states: %s", states.c_str());
    return states;
}
