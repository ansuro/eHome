## Application Component configuration
## Parameters configured here will override default and ENV values
## Uncomment and change examples:

## Add your source directories here separated by space
COMPONENT_SRCDIRS := app app/states
# COMPONENT_SRCFILES := 
COMPONENT_INCDIRS := include include/states

## If you require any Arduino Libraries list them here
ARDUINO_LIBRARIES := ArduinoJson6

## List the names of any additional Components required for this project
# COMPONENT_DEPENDS := mdns

## Set paths for any GIT submodules your application uses
# COMPONENT_SUBMODULES :=

## Append any targets to be built as dependencies of the project, such as generation of additional binary files
# CUSTOM_TARGETS += 

## Additional object files to be included with the application library
# EXTRA_OBJ :=

## Additional libraries to be linked into the project
# EXTRA_LIBS :=

## Provide any additional compiler flags
# COMPONENT_CFLAGS :=
# COMPONENT_CXXFLAGS :=

## Configure flash parameters (for ESP12-E and other new boards):
# SPI_MODE := dio

## SPIFFS options
# DISABLE_SPIFFS := 0
HWCONFIG = spiffs
SPIFF_FILES = files

## Refer to Basic_rBoot sample for options relating to rBoot

SMING_ARCH = Esp8266
# ENABLE_SSL = 0
ENABLE_SSL = Axtls
SPI_SIZE = 4M
COM_PORT = COM3
COM_SPEED = 74880
COM_SPEED_ESPTOOL = 921600