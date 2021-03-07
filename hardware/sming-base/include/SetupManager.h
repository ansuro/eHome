#pragma once

#include <SmingCore.h>
#include <Network/Http/Websocket/WebsocketResource.h>
#include <Network/Http/Websocket/WebsocketConnection.h>
#include <ArduinoJson6.h>

#include "IBaseManager.h"

class SetupManager : public IBaseManager
{
private:
	HttpServer httpServer;
	Vector<WebsocketConnection*> activeWebSockets;

	void setupHttpAndWebsocket();
	void setupWifi();

	// Websocket
	Timer mScanTimer;
	void doScanAndPropagate();
	void savehandler(WebsocketConnection &, const String &);
	void wsSendResult(bool saved, const String &reason = "");

	Credentials creds;

public:
    SetupManager(Configuration *config);
    ~SetupManager() = default;

    void boot() final;
};
