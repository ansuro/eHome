#pragma once

class IBaseManager
{
private:
    /* data */
public:
    // TODO check later how to correct define (virtual,...)
    // IBaseManager();
    ~IBaseManager() = default;

    virtual void boot() = 0;
};
