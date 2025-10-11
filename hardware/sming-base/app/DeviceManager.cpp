#include "DeviceManager.h"

#ifdef ENABLE_SSL
#include "ssl/private_key.h"
#include "ssl/cert.h"
#endif
DeviceManager::DeviceManager(Configuration *config) : IBaseManager(config)
{
#ifdef MQTT_HOST
    mMqttHost = MQTT_HOST;
#else
	#ifdef ENABLE_SSL
    	mMqttHost = "mqtts://api.ansuro.me";
	#else
    	mMqttHost = "mqtt://api.ansuro.me";
	#endif
#endif
     mMqttClient.setKeepAlive(5);
//     mMqttClient.setPingRepeatTime(7);

}

DeviceManager::~DeviceManager()
{
}


void DeviceManager::boot()
{
	Serial.printf("Device ID: %s\n", this->DEVICE_ID.c_str());

    // Wifi connected
    WifiEvents.onStationGotIP([this](IpAddress ip, IpAddress netmask, IpAddress gateway) {
        mWifiOnline = true;
        Serial.print("[Wifi] connected. IP: ");
        Serial.println(ip);
        connectMqtt();
    });

    // Wifi disconnected
    WifiEvents.onStationDisconnect([this](const String &ssid, MacAddress bssid, WifiDisconnectReason reason) {
        mWifiOnline = false;
        Serial.println("[Wifi] disconnected");
        BLed.set(BLed.ERROR_CON_WIFI);
    });

#ifdef ENABLE_SSL

    mMqttClient.setSslInitHandler([](Ssl::Session& session) {
    	session.options.verifyLater = true;
    	session.keyCert.assign(key_1024, sizeof(key_1024), x509_1024_cer,
    								   sizeof(x509_1024_cer), nullptr);
    });

#endif

    // MQTT connected
    mMqttClient.setConnectedHandler([this](MqttClient &client, mqtt_message_t *message) {
        Serial.println("[MQTT] connected");
        client.subscribe(DEVICE_ID);
        client.publish("register/" + DEVICE_ID, mMyDevice.getDeviceStates());
        BLed.set(BLed.OFF);
        return 0;
    });

    // MQTT disconnected
    mMqttClient.setDisconnectHandler([this](TcpClient &client, bool flag) {
        BLed.set(BLed.ERROR_CON_MQTT);
        if (flag == true)
        {
            Serial.print("[MQTT] Broker disconnected.");
        }
        else
        {
            Serial.print("[MQTT] Broker unreachable.");
        }
        Serial.println(" Retrying in 5sec.");
        mMqttReconnectTimer.initializeMs(5000, [this]() {
                               debugf("mqtt reconnect timer fired");
                               connectMqtt();
                           })
            .startOnce();
    });


    // MQTT message handler
    mMqttClient.setCallback([this](const String topic, const String message) {
        debugf("MQTT message received: %s (topic: %s)", message.c_str(), topic.c_str());

        if (topic == DEVICE_ID)
        {
            StaticJsonDocument<512> d;
            deserializeJson(d, message);
            const String stateName = d["name"];
            const String value = d["value"];
            debugf("name: %s, value: %s", stateName.c_str(), value.c_str());
            String msg = mMyDevice.handleStateChange(stateName, value);
            debugf("ret: %s", msg.c_str());
            mMqttClient.publish("status/" + DEVICE_ID, msg);
        }
    });

    mMyDevice.boot(&this->mMqttClient);

    // connect Wifi
#if defined(WIFI_SSID) && defined(WIFI_PW)
    Credentials cred = {WIFI_SSID, WIFI_PW};
#else
    Credentials cred = this->config->getCredentials();
#endif
    WifiStation.config(cred.ssid, cred.pw);
    WifiStation.enable(true);
    WifiStation.connect();
}

void DeviceManager::connectMqtt()
{
    if (!mWifiOnline)
    {
        mMqttReconnectTimer.stop();
        return;
    }
    Serial.printf("[MQTT] connecting to %s ...\n", mMqttHost.toString().c_str());
    mMqttClient.connect(mMqttHost, DEVICE_ID);
}
