#include "Configuration.h"

Configuration::Configuration() : mResetTimer() // @suppress("Class members should be properly initialized")
{
    if(spiffs_mount())
    {
    	debugf("spiffs mounted");
    	if(!fileExist("reset"))
    	{
    		debugf("file 'reset' not found. creating.");
    		auto f = fileOpen("reset", eFO_CreateNewAlways | eFO_WriteOnly);
    		char w = '0';
    		fileWrite(f, &w, sizeof(w));
    		fileClose(f);
    	}
    }
    else
    {
    	debugf("[ERROR] spiffs mount failed");
    }
}

Configuration::~Configuration()
{
    debugf("~Configuration");
}

bool Configuration::isConfigured() const
{
    bool e = fileExist(mCfgName);
    debugf("Configuration::isConfigured: %u", e);
    return e;
}

bool Configuration::save(const Credentials &creds)
{
    StaticJsonDocument<1024> cfg;
    cfg["ssid"] = creds.ssid.c_str();
    cfg["pw"] = creds.pw.c_str();

    serializeJson(cfg, Serial);
    String out;
    serializeJson(cfg, out);
    debugf("save: %s", out.c_str());
    return Json::saveToFile(cfg, mCfgName);
}

bool Configuration::deleteConfig()
{
    return fileDelete(mCfgName);
}

Credentials Configuration::getCredentials() const
{
    Credentials credentials;
    StaticJsonDocument<512> cfg;
    if (Json::loadFromFile(cfg, mCfgName))
    {
        credentials.ssid = cfg["ssid"].as<String>();
        credentials.pw = cfg["pw"].as<String>();
        debugf("getCredentials SSID: %s PW: %s", credentials.ssid.c_str(), credentials.pw.c_str());
    }
    else
    {
        debugf("loadFromFile failed");
    }

    return credentials;
}

void Configuration::handleResetCheck()
{
/*
 * 1. Datei vorhanden?
 * 2. Wenn ja: Reset flag set? Ja: setup mode; Nein: flag setzen, nach 7 sec. löschen
 */
	auto fReset = fileOpen("reset", eFO_ReadOnly);

	char r;
	if(fileRead(fReset, &r, sizeof(r)) < 1)
	{
		debugf("file 'reset' read failed");
		return;
	}
	fileClose(fReset);

//	debugf("RESET VALUE: %c", r);
	if(r == '1')
	{
		// reset button was clicked in between 5 seconds
		// set setup mode

		debugf("double reset detected");
		this->writeResetFlag(false);
		this->deleteConfig();
	}
	else
	{
		// set reset flag for 5 seconds
		this->writeResetFlag(true);

		this->mResetTimer.initializeMs(5000, [this](){
			this->writeResetFlag(false);
			debugf("reset timer fired");
		}).startOnce();
	}
}

void Configuration::writeResetFlag(bool enabled)
{
	auto f = fileOpen("reset", eFO_WriteOnly);
	char w = enabled ? '1' : '0';
	fileWrite(f, &w, sizeof(w));
	fileClose(f);
}
