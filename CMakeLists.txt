#simple cmake file for the project
cmake_minimum_required(VERSION 3.5)
project(Particles)

#set the c++ standard to c++20
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

#set outputs directorry
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/bin)

#add the source files to the project



#set SFML libraries to the project "MacOS"
if (APPLE)
    set(SFML_DIR  "/opt/homebrew/Cellar/sfml/2.6.1/include/SFML" )
endif()

#find the SFML libraries
find_package(SFML 3.0.0 REQUIRED COMPONENTS Graphics Audio Network System)
message("SFML was found = ${SFML_FOUND}")

#link image to build
set(MACOSX_BUNDLE_ICON_FILE myAppImage)

set(myApp_ICON ${CMAKE_CURRENT_SOURCE_DIR}/ico.png)
set_source_files_properties(${myApp_ICON} PROPERTIES MACOSX_PACKAGE_LOCATION "Resources")

#upload font to build
set(myApp_FONT ${CMAKE_CURRENT_SOURCE_DIR}/Muli-Regular.ttf)
set_source_files_properties(${myApp_FONT} PROPERTIES MACOSX_PACKAGE_LOCATION "Resources/Fonts")



add_executable(Particles MACOSX_BUNDLE ${myApp_ICON} ${myApp_FONT} src/main.cpp)

#build project in release mode for MACOS 
if (APPLE)
target_link_libraries(Particles "-framework CoreFoundation")
    target_compile_options(Particles PUBLIC -O3)
    set_target_properties(Particles PROPERTIES CXX_STANDARD 20 CXX_STANDARD_REQUIRED ON)
    target_link_libraries(Particles   
        SFML::Graphics
        SFML::System)
    
    set_target_properties(Particles PROPERTIES MACOSX_BUNDLE TRUE)
    set_target_properties(Particles PROPERTIES MACOSX_BUNDLE_BUNDLE_NAME "Particles")
    set_target_properties(Particles PROPERTIES MACOSX_BUNDLE_BUNDLE_VERSION "1.0")
    set_target_properties(Particles PROPERTIES MACOSX_BUNDLE_SHORT_VERSION_STRING "1.0")
    set_target_properties(Particles PROPERTIES MACOSX_BUNDLE_LONG_VERSION_STRING "1.0")
    set_target_properties(Particles PROPERTIES MACOSX_BUNDLE_ICON_FILE "ico.png")
    set_target_properties(Particles PROPERTIES RESOURCE "${myApp_ICON}")
    set_target_properties(Particles PROPERTIES RESOURCE "${myApp_FONT}")

    
    set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin) 
endif()







#build project in release mode for WINDOWS
if (WIN32)
    target_compile_options(Particles PUBLIC -O3)
endif()

#build project in release mode for LINUX and UNIX
if (UNIX AND NOT APPLE)
    target_compile_options(Particles PUBLIC -O3)
endif()