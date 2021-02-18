#include "EHome.h"
#include "settings.h"

EHome::EHome()
{
    debugf("EHome");
}

EHome::~EHome()
{
    debugf("~EHome");
}

void EHome::boot()
{
    Serial.println("eHome booting...");
    // BuiltinLed, Configuration + the desired manager
    BLed.set(BLed.BOOTING);
#if defined(WIFI_SSID) && defined(WIFI_PW)
    Serial.println("WIFI_SSID & WIFI_PW is set programmatically");
    manager = new DeviceManager();
    ((DeviceManager *)manager)->setCredentials(WIFI_SSID, WIFI_PW);
#else
    // TODO test.. and finish..
    mConfig = new Configuration();
    if (mConfig->isConfigured())
    {
        debugf("Booting configured");
        // DeviceManager deviceManager;
        // deviceManager.boot();

        auto s = mConfig->getCredentials();
        debugf("Config loaded: SSID -> %s PW -> %s", s.ssid.c_str(), s.pw.c_str());
        manager = new DeviceManager();
        ((DeviceManager *)manager)->setCredentials(s.ssid, s.pw);
        ((DeviceManager *)manager)->onRequest(rrd);
    }
    else
    {
        debugf("Booting unconfigured");
        // if(mConfig->save("ssid1", "pw1"))
        // {
        //     debugf("new config written");
        // }
    }

#endif
    manager->boot();
    debugf("boot end");
}