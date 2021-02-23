#include "OnOffOptionsState.h"

OnOffOptionsState::OnOffOptionsState(const String &name, Vector<String> *options, const Delegate<String(const String &, const String &)> cb) : State(name)
{
    this->options = options;
    this->cb = cb;
}

String OnOffOptionsState::handle(const String &value)
{
    if (!this->options->contains(value))
    {
        debugf("Unknown option[state: %s]: %s", this->name.c_str(), value.c_str());
        return "Error";
    }

    this->curValue = this->cb(this->curValue, value);
    StaticJsonDocument<256> doc;
    doc["name"] = this->name;
    doc["value"] = this->curValue;
    doc["type"] = static_cast<int>(StateTypes::ON_OFF_OPTIONS);

    JsonArray arrOptions = doc.createNestedArray("options");

    size_t y = this->options->count();
    for (size_t i = 0; i < y; i++)
    {
        arrOptions.add(this->options->get(i));
    }

    String ret;
    serializeJson(doc, ret);
    return ret;
}
