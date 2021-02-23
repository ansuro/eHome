#ifndef DEVICEMANAGER_H
#define DEVICEMANAGER_H

#include "EHome.h"
#include "MyDevice.h"

class DeviceManager : public IBaseManager
{
private:
    const String DEVICE_ID = WifiStation.getMAC(':');
    MqttClient mMqttClient;
    String mSSID;
    String mPW;
    Url mMqttHost;
    MyDevice mMyDevice;
    Timer mMqttReconnectTimer;
    bool mWifiOnline = false;

    void connectMqtt();

public:
    DeviceManager();
    virtual ~DeviceManager();

    void setCredentials(const String &ssid, const String &pw);
    void boot() final;
};

#endif
