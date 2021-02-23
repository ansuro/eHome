#include "ValueState.h"

ValueState::ValueState(const String &name, uint32_t refreshTimeInMs, const Delegate<String(void)> cb, MqttClient *mqttClient)
{
    this->cb = cb;
    this->name = name;
    this->curValue = cb();
    this->mqttClient = mqttClient;

    auto td = TimerDelegate(&ValueState::handleTimer, this);
    pTimer.initializeMs(refreshTimeInMs, td).start();
}

void ValueState::handleTimer()
{
     if(this->mqttClient->getConnectionState() == TcpClientState::eTCS_Connected)
     {
         // mqtt is connected
         Serial.println("mqtt connected");
         String val = this->cb();
         this->curValue = val;

         StaticJsonDocument<256> doc;
         doc["name"] = this->getName();
         doc["value"] = this->getValue();
         doc["type"] = static_cast<int>(StateTypes::VALUE_ONLY);

         String s;
         serializeJson(doc, s);
//         Serial.printf("ValueState json: %s\n", s.c_str());
          mqttClient->publish("status/" + DEVICE_ID, s);
     }
}
