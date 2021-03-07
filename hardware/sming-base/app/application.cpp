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
//	WifiAccessPoint.enable(false);
	// WifiStation.enable(false);

	System.onReady(onSystemReady);
}
