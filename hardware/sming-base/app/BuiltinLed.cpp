#include "BuiltinLed.h"

void BuiltinLed::set(LedState state)
{
    switch (state)
    {
    case OFF:
        setLed(LED_OFF);
        break;

    case BOOTING:
        setLed(LED_ON);
        break;

    case UNCONFIGURED:
        setLedBlink(1500);
        break;

    case ERROR_CON_WIFI:
        setLedBlink(500);
        break;

    case ERROR_CON_MQTT:
        setLedBlink(800);
        break;

    default:
        break;
    }
}

// Device configured + connected: LED off
void BuiltinLed::setLed(bool state)
{
    mLedState = state;
    debugf("setLed");
    if (mLedTimer.isStarted())
        mLedTimer.stop();

    digitalWrite(BUILTIN_LED_PIN, mLedState);
}

// LED blink
void BuiltinLed::setLedBlink(uint32_t interval)
{
    debugf("setLedBlink");
    TimerDelegate tg = [this]() {
        digitalWrite(BUILTIN_LED_PIN, mLedState);
        mLedState = !mLedState;
    };
    mLedTimer.initializeMs(interval, tg).start();
}

BuiltinLed::~BuiltinLed()
{
    debugf("~BuiltinLed");
    if (mLedTimer.isStarted())
        mLedTimer.stop();
}