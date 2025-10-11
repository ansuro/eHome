#include "OnOffState.h"

OnOffState::OnOffState(const String &name, const Delegate<bool(const bool curValue, const bool newValue)> cb) : State(name)
{
    this->cb = cb;
}

String OnOffState::handle(const String &newValue)
{
    if(newValue != "true" && newValue != "false")
    {
        return "Error";
    }

    bool c = newValue == "true" ? true : false;


    this->curValue = this->cb(this->curValue, c);
    StaticJsonDocument<256> doc;
    doc["name"] = this->name;
    doc["value"] = this->curValue;
    doc["type"] = static_cast<int>(StateTypes::ON_OFF);

    String ret;
    serializeJson(doc, ret);
    return ret;
}
