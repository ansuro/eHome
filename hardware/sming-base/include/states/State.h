#pragma once
#include <SmingCore.h>

class State
{
protected:
    String name;

public:
    State() = default;
    State(const String &name)
    {
        this->name = name;
    }
    ~State() = default;

    String getName() { return name; }

    virtual String handle(const String &newValue) = 0;
};
