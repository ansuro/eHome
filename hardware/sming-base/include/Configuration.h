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
    Timer mResetTimer;
    void writeResetFlag(bool enabled);

public:
    Configuration();
    ~Configuration();
    bool isConfigured() const;
    bool save(const Credentials &creds);
    bool deleteConfig();
    Credentials getCredentials() const;
    void handleResetCheck();
};

#endif
