#include "MyDevice.h"

/*
 * StateTypes:
    OnOff { name, value, type = 0 }
    OnOffOptions { name, value, optionslist, type = 1 }
    ValueOnly { name, value, type = 2 }
*/

void MyDevice::defineStates()
{
    this->deviceStates.addOnOffState("TestState1",
                                     [](const bool curValue, const bool newValue) -> bool {
                                         Serial.println("TestState1");
                                         // false = LED on
                                         digitalWrite(2, !newValue);
                                         return newValue;
                                     });

    Vector<String> *opts = new Vector<String>();
    opts->add("off"); opts->add("red"); opts->add("green"); opts->add("blue");
    this->deviceStates.addOnOffOptionsState("TestState2", opts, [](const String &curValue, const String &newValue) -> String {
        Serial.printf("TestState2 - new option: %s", newValue.c_str());
        return newValue;
    });

    this->deviceStates.addValueOnlyState("TestState3", 5000, []() -> String {
        Serial.println("TestState3 timer...");
        int r = rand() % 5;
        return String(r);
    });
}

String MyDevice::handleStateChange(const String &stateName, const String &value)
{
    return this->deviceStates.handleStateChange(stateName, value);
}

// return all states on connect
String MyDevice::getDeviceStates()
{
    return this->deviceStates.getStatesAsJsonString();
}

void MyDevice::boot(MqttClient *mClient)
{
    this->deviceStates.setMqtt(mClient);
    this->defineStates();
}
