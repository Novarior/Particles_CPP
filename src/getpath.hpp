#ifndef some_FUCK
#define some_FUCK

#include "headers.hpp"

std::string get_resources_dir()
{
    CFURLRef resourceURL = CFBundleCopyResourcesDirectoryURL(CFBundleGetMainBundle());
    char resourcePath[PATH_MAX];
    if (CFURLGetFileSystemRepresentation(resourceURL, true, (UInt8*)resourcePath, PATH_MAX)) {
        if (resourceURL != NULL) {
            CFRelease(resourceURL);
        }
        return resourcePath;
    }
    return "";
}
#endif