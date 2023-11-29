// include header
#include "getpath.hpp"
#include "headers.hpp"
#include "particle.hpp"

int main()
{

    // create SFML window 800x600 with title "particle system" on fullscreen
    sf::RenderWindow window(sf::VideoMode(2560, 1600), "particle system", sf::Style::Fullscreen);
    // set framerate limit to 120 fps and vertical sync enabled
    window.setFramerateLimit(120);
    window.setVerticalSyncEnabled(true);
    // set window fullscreen

    std::stringstream ss;
    ss << get_resources_dir() << "/Muli-Regular.ttf";
    // load font
    sf::Font font;
    if (!font.loadFromFile(ss.str()))
        printf("Failed to load font");

    std::cout << ss.str() << std::endl;

    // text for fps counter
    sf::Text m_fps;
    m_fps.setFont(font);
    m_fps.setCharacterSize(20);
    m_fps.setFillColor(sf::Color::White);
    m_fps.setPosition(10, 10);

    // window events
    sf::Event event;

    // create particle system
    ParticleSystem particles(400'000, sf::Vector2f(window.getSize()));

    // clock
    sf::Clock clock;
    float deltaTime = 0.f;

    // debug text
    std::stringstream buffer;
    sf::Vector2f bufferPos = { 0, 0 };

    // main loop
    while (window.isOpen()) {
        // event loop
        while (window.pollEvent(event)) {
            // close window on close event
            if (event.type == sf::Event::Closed) {
                window.close();
            }
            // close window on escape key pressed
            if (event.type == sf::Event::KeyPressed) {
                if (event.key.code == sf::Keyboard::Escape) {
                    window.close();
                }
            }
            // call change color mode on key pressed (C)
            if (event.type == sf::Event::KeyPressed) {
                if (event.key.code == sf::Keyboard::C) {
                    particles.change_draw_mode();
                }
            }
        }
        // update delta time
        deltaTime = clock.restart().asSeconds();

        // move view using sin and cos functions
        //  multiply by delta time to make it framerate independen
        bufferPos.x += deltaTime;
        bufferPos.y += deltaTime;

        // update view

        // update text counter
        ss << "FPS: " + std::to_string((int)(1.f / deltaTime))
           << "\nParticles: " + std::to_string(particles.get_size())
           << "\nEmitter[0] lifetime: " + std::to_string(particles.get_zeroEmitterLifeTime())
           << "\nParticle[0] alpha: " + std::to_string(particles.get_alpha())
           << "\nDraw mode:\t" + particles.get_draw_mode();

        m_fps.setString(ss.str());
        ss.str("");

        // make the particle system emitter follow the mouse
        sf::Vector2i mouse = sf::Mouse::getPosition(window);
        // particles.setEmitter(window.mapPixelToCoords(mouse));
        particles.setEmitter(sf::Vector2f(
            850 + sin(bufferPos.x / 10) * 300,
            530 + cos(bufferPos.y / 10) * 300));

        // update particle system
        particles.update(deltaTime);

        // set view
        // draw it
        window.clear();
        window.draw(particles);
        window.draw(m_fps);
        window.display();
    }

    return 0;
}