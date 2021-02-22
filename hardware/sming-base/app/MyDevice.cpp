#include "MyDevice.h"

// StateTypes
//     OnOff = 0,
//     OnOffOptions = 1,
//     ValueOnly = 2

/*
    OnOff { name, value, type = 0 }
    OnOffOptions { name, value, optionslist, type = 1 }
    ValueOnly { name, value, type = 2 }
*/

MyDevice::MyDevice()
{
}

MyDevice::~MyDevice()
{
}

void MyDevice::defineStates()
{
    this->deviceStates.addOnOffState("TestState1",
                                     [](const bool curValue, const bool newValue) -> bool {
                                         Serial.println("TestState1 lambda");
                                        //  this->BLed.setLed(!curValue);
                                         digitalWrite(2, false);
                                         return !curValue;
                                     });

    Vector<String> *opts = new Vector<String>();
    opts->add("red"); opts->add("green"); opts->add("blue");
    this->deviceStates.addOnOffOptionsState("TestState2", opts, [](const String &curValue, const String &newValue) -> String {
        Serial.println("TestState2");
        return newValue;
    });

    this->deviceStates.addValueOnlyState("TestState3", 5000, []() -> String {
        Serial.println("TestState3 timer...");
        return "";
    });
}

String MyDevice::handleStateChange(const String &stateName, const String &value)
{
    return this->deviceStates.handleStateChange(stateName, value);
    // return this->deviceStates.getStatesAsJsonString();

    // if (stateName == "Plug 1")
    // {
    //     // String msg;
    //     mState1 = !mState1;
    //     debugf("Plug 1, new state: %u", mState1);
    //     // JsonObject state1 = j.to<JsonObject>();
    //     // state1["name"] = stateName;
    //     // state1["type"] = 0;
    //     // state1["value"] = mState1 ? "true" : "false";
    //     // serializeJson(j, msg);
    //     // return msg;
    //     return getDeviceStates();
    // }
    // else if (stateName == "Plug 2")
    // {
    //     // String msg;
    //     mState2 = !mState2;
    //     debugf("Plug 2, new state: %u", mState2);
    //     // JsonObject state1 = j.to<JsonObject>();
    //     // state1["name"] = stateName;
    //     // state1["type"] = 0;
    //     // state1["value"] = mState2 ? "true" : "false";
    //     // serializeJson(j, msg);
    //     // return msg;
    //     return getDeviceStates();
    // }
    // else if (stateName == "Plug 3")
    // {
    //     // String msg;
    //     mState3 = !mState3;
    //     debugf("Plug 3, new state: %u", mState3);
    //     // JsonObject state1 = j.to<JsonObject>();
    //     // state1["name"] = stateName;
    //     // state1["type"] = 0;
    //     // state1["value"] = mState3 ? "true" : "false";
    //     // serializeJson(j, msg);
    //     // return msg;
    //     return getDeviceStates();
    // }

    // Serial.printf("Unknown state: %s\n", stateName.c_str());

    // // TODO create error state and react accordingly in backend -> frontend
    // String e = "Error";
    // return e;
}

// String MyDevice::getDeviceStates()
// {
//     StaticJsonDocument<256> s;
//     JsonArray array = s.to<JsonArray>();

//     // define your states
//     JsonObject state1 = array.createNestedObject();
//     state1["name"] = "Plug 1";
//     state1["type"] = 0;
//     state1["value"] = mState1;

//     JsonObject state2 = array.createNestedObject();
//     state2["name"] = "Plug 2";
//     state2["type"] = 0;
//     state2["value"] = mState2;

//     JsonObject state3 = array.createNestedObject();
//     state3["name"] = "Plug 3";
//     state3["type"] = 0;
//     state3["value"] = mState3;

//     states = "";
//     serializeJson(array, states);
//     debugf("states: %s", states.c_str());
//     return states;
// }

// return all states on connect
String MyDevice::getDeviceStates()
{
    return this->deviceStates.getStatesAsJsonString();
}

void MyDevice::boot(MqttClient *mClient)
{
    this->deviceStates.setMqtt(mClient);
    this->defineStates();
    // mClient.publish("status/48:3f:da:01:ad:65", "Test MSG");
}
