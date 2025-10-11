#pragma once

#include "Configuration.h"
#include "settings.h"

class IBaseManager
{
private:

protected:
    Configuration *config;

public:
	IBaseManager(Configuration *config) { this->config = config; };
    virtual ~IBaseManager() = default;

    virtual void boot() = 0;
};
