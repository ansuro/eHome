#include <SmingCore.h>

#include "EHome.h"

EHome ehome;

void onSystemReady()
{
	ehome.boot();
}

void init()
{
	Serial.begin(74880);
	Serial.systemDebugOutput(SYSTEM_DEBUG_OUTPUT);
	WifiAccessPoint.setIP(IPAddress(192, 168, 4, 1));

	System.onReady(onSystemReady);
}
