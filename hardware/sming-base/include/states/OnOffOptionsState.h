#pragma once

#include <SmingCore.h>
#include <ArduinoJson6.h>

#include "State.h"
#include "StateTypes.h"

class OnOffOptionsState : public State
{
private:
    Delegate<String(const String &, const String &)> cb;
    String curValue;
    Vector<String> *options;

public:
    OnOffOptionsState() = default; // @suppress("Class members should be properly initialized")
    OnOffOptionsState(const String &name, Vector<String> *options, const Delegate<String(const String &, const String &)> cb);
    virtual ~OnOffOptionsState() = default;

    String getValue() { return curValue; }
    Vector<String> *getOptions() { return options; }

    String handle(const String &value);
};
