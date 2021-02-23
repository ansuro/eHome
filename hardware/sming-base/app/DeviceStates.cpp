#include "DeviceStates.h"

DeviceStates::DeviceStates() // @suppress("Class members should be properly initialized")
{
}

DeviceStates::~DeviceStates()
{
}

void DeviceStates::addOnOffState(const String &name, Delegate<bool(const bool, const bool)> cb)
{
    this->mOnOffStates[name] = new OnOffState(name, cb);
}

void DeviceStates::addOnOffOptionsState(const String &name, Vector<String> *options, Delegate<String(const String &, const String &)> cb)
{
    this->mOnOffOptionsStates[name] = new OnOffOptionsState(name, options, cb);
}

void DeviceStates::addValueOnlyState(const String &name, uint32_t refreshTimeInMs, Delegate<String(void)> cb)
{
    this->mValueStates[name] = new ValueState(name, refreshTimeInMs, cb, this->mqttClient);
}

// returns the changed state as json
String DeviceStates::handleStateChange(const String &stateName, const String &value)
{
    if (this->mOnOffStates.contains(stateName))
    {
        OnOffState *s = this->mOnOffStates[stateName];
        return s->handle(value);
    }
    else if (this->mOnOffOptionsStates.contains(stateName))
    {
        OnOffOptionsState *s = this->mOnOffOptionsStates[stateName];
        return s->handle(value);
    }

    // state not found
    debugf("state not found: %s", stateName.c_str());
    return "Error";
}

// returns all states as json
String DeviceStates::getStatesAsJsonString()
{
    StaticJsonDocument<1024> doc;
    JsonArray array = doc.to<JsonArray>();

    size_t count = mOnOffStates.count();
    for (size_t i = 0; i < count; i++)
    {
        OnOffState *oos = mOnOffStates.valueAt(i);
        JsonObject state = array.createNestedObject();
        state["name"] = oos->getName();
        state["value"] = oos->getValue();
        state["type"] = static_cast<int>(StateTypes::ON_OFF);
    }

    count = mOnOffOptionsStates.count();
    for (size_t i = 0; i < count; i++)
    {
        OnOffOptionsState *oos = mOnOffOptionsStates.valueAt(i);
        JsonObject state = array.createNestedObject();
        state["name"] = oos->getName();
        state["value"] = oos->getValue();
        state["type"] = static_cast<int>(StateTypes::ON_OFF_OPTIONS);
        JsonArray options = state.createNestedArray("options");
        Vector<String> *opt = oos->getOptions();
        size_t y = opt->count();
        for (size_t i = 0; i < y; i++)
        {
            options.add(opt->get(i));
        }
    }

    count = mValueStates.count();
    for (size_t i = 0; i < count; i++)
    {
        ValueState *v = mValueStates.valueAt(i);
        JsonObject state = array.createNestedObject();
        Serial.printf("Value State: %s %s", v->getName().c_str(), v->getValue().c_str());
        state["name"] = v->getName();
        state["value"] = v->getValue();
        state["type"] = static_cast<int>(StateTypes::VALUE_ONLY);
    }

    String s;
    serializeJson(array, s);
    debugf("Devices json: %s", s.c_str());
    return s;
}

void DeviceStates::setMqtt(MqttClient *mClient)
{
    this->mqttClient = mClient;
}
