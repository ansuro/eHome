#include "EHome.h"
#include "settings.h"

EHome::EHome() // @suppress("Class members should be properly initialized")
{
    debugf("EHome");
}

EHome::~EHome()
{
    debugf("~EHome");
}

void EHome::boot()
{
	// check double reset-button-click: delete config
    mConfig.handleResetCheck();

    Serial.println("eHome booting...");
    BLed.set(BLed.BOOTING);

    mConfig.getCredentials();

#if defined(WIFI_SSID) && defined(WIFI_PW)
    manager = new DeviceManager(&mConfig);
#else
    if(mConfig.isConfigured())
    {
    	manager = new DeviceManager(&mConfig);
    }
    else
    {
    	manager = new SetupManager(&mConfig);
    }
#endif

    manager->boot();
    debugf("boot end");
}
