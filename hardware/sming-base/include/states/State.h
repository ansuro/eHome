#pragma once
#include <SmingCore.h>

class State // @suppress("Class has a virtual method and non-virtual destructor")
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
