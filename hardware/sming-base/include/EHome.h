#pragma once

#include "ehome_types.h"
#include "Configuration.h"
#include "BuiltinLed.h"
#include "IBaseManager.h"
#include "DeviceManager.h"
#include "SetupManager.h"

static BuiltinLed BLed;

class EHome
{
private:
    Configuration *mConfig;
    IBaseManager *manager;
public:
    EHome();
    ~EHome();
    void boot();
};
