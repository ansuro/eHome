#include <SmingCore.h>

#include "EHome.h"
// #include "ehome_types.h"

EHome ehome;

bool state = false;

String onRequest(const String &topic, const String &message)
{
	debugf("Topic: %s Message: %s, current state: %u", topic.c_str(), message.c_str(), state);
	// StaticJsonDocument<200> j;
	state = !state;
	String s = (state ? "on" : "off");
	String ret = "{\"status\": \"" + s + "\"}";

	return ret;
}

void onSystemReady()
{
	ehome.boot(onRequest);
}

void init()
{
	Serial.begin(74880);
	Serial.systemDebugOutput(SYSTEM_DEBUG_OUTPUT);
	WifiAccessPoint.enable(false);
	// WifiStation.enable(false);

	System.onReady(onSystemReady);
}