#include "SetupManager.h"


SetupManager::SetupManager(Configuration *config) : IBaseManager(config)
{
	auto td = TimerDelegate(&SetupManager::doScanAndPropagate, this);
	mScanTimer.initializeMs(10000, td);
}

void SetupManager::boot()
{
	this->setupWifi();
	this->setupHttpAndWebsocket();
}

void SetupManager::setupHttpAndWebsocket()
{
	// HTML index page
	httpServer.paths.set("/", [](HttpRequest& request, HttpResponse& response){
		auto index = new TemplateFileStream(F("index.html"));

		auto& vars = index->variables();
		vars["mac"] = WifiStation.getMAC(':');

		response.sendNamedStream(index);
	});

	httpServer.paths.setDefault([](HttpRequest& request, HttpResponse& response) {
		String file = request.uri.getRelativePath();

		if(file[0] == '.')
			response.code = HTTP_STATUS_FORBIDDEN;
		else {
			// TODO just 4 dev
//			response.setCache(86400, true);
			response.sendFile(file);
		}
	});

	// Websocket
	auto wsResource = new WebsocketResource();
	wsResource->setConnectionHandler([this](WebsocketConnection& socket) {
		this->activeWebSockets.addElement(&socket);
		debugf("websocket connected");
	});

	wsResource->setDisconnectionHandler([this](WebsocketConnection& socket){
		this->activeWebSockets.removeElement(&socket);
		debugf("websocket disconnected");
	});

	auto sh = WebsocketMessageDelegate(&SetupManager::savehandler, this);
	wsResource->setMessageHandler(sh);

	httpServer.paths.set("/ws", wsResource);

	bool li = httpServer.listen(80);
	debugf("server listening: %d", li);

	mScanTimer.start();
}

void SetupManager::doScanAndPropagate()
{
	WifiStation.startScan([this](bool succeeded, BssList& list) {
		DynamicJsonDocument doc(1024);
		JsonObject obj = doc.to<JsonObject>();
		obj["type"] = 0;
		JsonArray wifis = obj.createNestedArray("wifis");

		if(!succeeded) {
			Serial.println(_F("Failed to scan networks"));
			return;
		}

		for(unsigned i = 0; i < list.count(); i++) {
//			Serial.print(_F("\tWiFi: "));
//			Serial.print(list[i].ssid);
//			Serial.print(", ");
//			Serial.print(list[i].getAuthorizationMethodName());
//			if(list[i].hidden) {
//				Serial.print(_F(" (hidden)"));
//			}
//			Serial.println();
			JsonObject jso = wifis.createNestedObject();
			jso["ssid"] = list[i].ssid;
			jso["auth"] = list[i].getAuthorizationMethodName();
			jso["signal"] = list[i].rssi;
			jso["hidden"] = list[i].hidden;
		}


		String res = "";

		serializeJson(doc, res);

		WebsocketConnection::broadcast(res);
	});
}

void SetupManager::savehandler(WebsocketConnection &connection, const String &message)
{

	debugf("save msg: %s", message.c_str());
	DynamicJsonDocument msg(1024);
	deserializeJson(msg, message);

	String ssid = msg["ssid"];
	String pw = msg["pw"];
	Serial.printf("[SaveHandler] ssid: %s, pw: %s\n", ssid.c_str(), pw.c_str());

	if(ssid == null || ssid == "" || ssid.length() < 1)
	{
		// Error somehow
		this->wsSendResult(false, "malformed message");
		return;
	}

	this->mScanTimer.stop();
	this->creds.ssid = ssid;
	this->creds.pw = pw;
	WifiStation.config(ssid, pw, false, false);
	WifiStation.connect();
}

void SetupManager::wsSendResult(bool saved, const String &reason)
{
	DynamicJsonDocument doc(1024);
	JsonObject jmsg = doc.to<JsonObject>();
	jmsg["type"] = 1;
	jmsg["saved"] = saved;

	if(!saved)
		jmsg["reason"] = reason;

	String msg;
	serializeJson(doc, msg);
	WebsocketConnection::broadcast(msg);
	this->mScanTimer.start();
}

void SetupManager::setupWifi()
{
	// Access Point Mode
	WifiAccessPoint.config(_F("EHome Controller Config"), nullptr, AUTH_OPEN);
	WifiAccessPoint.enable(true);
	WifiStation.enable(true);

	// connection testing handler
	WifiEvents.onStationGotIP([this](IpAddress ip, IpAddress netmask, IpAddress gateway) {
		Serial.print("[Wifi] connected. IP: ");
		Serial.println(ip);

		Serial.printf("Creds, ssid: %s, pw: %s", this->creds.ssid.c_str(), this->creds.pw.c_str());

		// save cfg, ws broadcast, reboot
		if(this->config->save(this->creds))
		{
			// works only if there was no channel switch
			this->wsSendResult(true);
			System.restart(5000);
		}
	});

	WifiEvents.onStationDisconnect([this](const String& ssid, MacAddress bssid, WifiDisconnectReason reason) {
		// get reason, disable WifiStation, ws broadcast
		Serial.printf("onStationDisconnect: %s\n",  WifiEvents.getDisconnectReasonName(reason).c_str());
		WifiStation.disconnect();

		// ignore 4WAY_HANDSHAKE_TIMEOUT
		if(reason != WifiDisconnectReason::WIFI_DISCONNECT_REASON_4WAY_HANDSHAKE_TIMEOUT)
		{
			this->wsSendResult(false, WifiEvents.getDisconnectReasonName(reason));
		}
	});

	WifiEvents.onAccessPointConnect([](MacAddress mac, uint16_t aid){
		Serial.printf("station connect 2 AP: %s\n", mac.toString().c_str());
	});

	WifiEvents.onAccessPointDisconnect([](MacAddress mac, uint16_t aid){
			Serial.printf("station disconnected from AP: %s\n", mac.toString().c_str());
	});
}
