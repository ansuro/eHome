#pragma once

#include <SmingCore.h>
#include "settings.h"

class BuiltinLed
{
private:
    // static const unsigned short BUILTIN_LED_PIN = 2;
    static const bool LED_ON = false;
    static const bool LED_OFF = true;

    Timer mLedTimer;
    bool mLedState;

    void setLedBlink(uint32_t interval);

    // BuiltinLed() = default;
    // BuiltinLed(const BuiltinLed&) = delete;
    // BuiltinLed& operator=(const BuiltinLed&) = delete;

public:
    typedef enum
    {
        OFF,
        BOOTING,
        UNCONFIGURED,
        ERROR_CON_WIFI,
        ERROR_CON_MQTT
    } LedState;

    BuiltinLed()
    {
        debugf("BuiltinLed()");
        pinMode(BUILTIN_LED_PIN, OUTPUT);
    }

    ~BuiltinLed();

    void setLed(bool state);
    void set(LedState state);
};
