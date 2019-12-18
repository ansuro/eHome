#ifndef CONFIGURATION_H
#define CONFIGURATION_H

#include <SmingCore.h>
#include <ArduinoJson6.h>

typedef struct {
    String ssid;
    String pw;
} Credentials;

class Configuration
{
private:
    const String mCfgName = "config.cfg";
public:
    Configuration(/* args */);
    ~Configuration();
    bool isConfigured() const;
    bool save(String ssid, String pw);
    bool deleteConfig();
    Credentials getCredentials() const;
};

#endif