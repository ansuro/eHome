#pragma once

#include <SmingCore.h>
#include <ArduinoJson6.h>

#include "State.h"
#include "StateTypes.h"

class OnOffState : public State
{
private:
    Delegate<bool(const bool, const bool)> cb;
    bool curValue = false;

public:
    OnOffState() = default;
    OnOffState(const String &name, const Delegate<bool(const bool, const bool)> cb);
    virtual ~OnOffState() = default;

    bool getValue() { return curValue; }

    String handle(const String &value);
};
