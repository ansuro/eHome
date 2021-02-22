#include "ValueState.h"

ValueState::ValueState(const String &name, uint32_t refreshTimeInMs, const Delegate<String(void)> cb, MqttClient *mqttClient)
{
    this->cb = cb;
    this->name = name;
    this->curValue = "curValue";
    this->mqttClient = mqttClient;
    // Serial.printf("timer lambda");
    // TcpClientState s = mqttClient2->getConnectionState();
    // Serial.printf("TEST -------------------- %i", static_cast<int>(s));
    auto td = TimerDelegate(&ValueState::handleTimer, this);
    pTimer.initializeMs(5000, td).start();
    // pTimer.initializeMs(refreshTimeInMs, td).start();

    // pTimer.initializeMs(1000, [mqttClient2]() -> void {
    //     Serial.printf("timer lambda");
    //     TcpClientState s = mqttClient2->getConnectionState();
    //     Serial.printf("TEST -------------------- %i", static_cast<int>(s));
    // }).start();
}

void ValueState::handleTimer()
{
    Serial.printf("handleTimer");
    TcpClientState s = this->mqttClient->getConnectionState();
    Serial.printf("TEST -------------------- %i", static_cast<int>(s));
    // TcpClientState s = this->mqttClient->getConnectionState();
    // Serial.printf("%i",  static_cast<short>(s));
    // TODO 1. check mqtt connection, if connected call cb

    // if(this->mqttClient->getConnectionState() == TcpClientState::eTCS_Ready)
    // {
    //     // mqtt is connected
    //     Serial.println("mqtt connected");
    // }
    // else
    // {
    //     Serial.println("mqtt not connected");
    // }

    // mqttClient->publish("status/" + DEVICE_ID, "Test MSG");
}