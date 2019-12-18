#include "Configuration.h"

Configuration::Configuration(/* args */)
{
    spiffs_mount();
    debugf("spiffs mounted");
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

// TODO untested, later..
bool Configuration::save(String ssid, String pw)
{
    StaticJsonDocument<512> cfg;
    cfg["ssid"] = ssid.c_str();
    cfg["pw"] = pw.c_str();

    serializeJson(cfg, Serial);
    String out;
    serializeJson(cfg, out);
    debugf("save: %s", out.c_str());
    return Json::saveToFile(cfg, mCfgName);
}

bool Configuration::deleteConfig()
{
    return false;
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
