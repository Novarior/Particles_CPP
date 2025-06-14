// include header
#include "getpath.hpp"
#include "headers.hpp"
#include "particle.hpp"
#include <SFML/OpenGL.hpp>
#include <filesystem>
#include <optional>

int main() {

  // create SFML window 800x600 with title "particle system" on fullscreen
  sf::RenderWindow window(sf::VideoMode({800, 600}), "particle system",
                          sf::Style::Default);
  // set framerate limit to 120 fps and vertical sync enabled
  window.setFramerateLimit(120);
  window.setVerticalSyncEnabled(true);
  // set window fullscreen

  // load font
  sf::Font font(
      std::filesystem::path(get_resources_dir().append("/Muli-Regular.ttf")));

  sf::Shader shdr(std::filesystem::path(get_resources_dir().append("/sp.frag")),
                  sf::Shader::Type::Fragment);

  // sf::Texture t_holder(
  //    std::filesystem::path(get_resources_dir().append("/ico.png")));

  std::stringstream ss;
  sf::RectangleShape shape;
  shape.setSize(sf::Vector2f(window.getSize()));
  shape.setFillColor(sf::Color::White);
  // shape.setTexture(&t_holder);

  // text for fps counter
  sf::Text m_fps(font, "", 20);
  m_fps.setFillColor(sf::Color::White);
  m_fps.setOutlineThickness(1.f);
  m_fps.setOutlineColor(sf::Color::Black);
  m_fps.setPosition({10, 10});

  // create particle system
  // ParticleSystem particles(400'000, sf::Vector2f(window.getSize()));

  // clock
  sf::Clock clock;
  float deltaTime = 0.f;
  float mTime = 0.f;

  // debug text
  sf::Vector2f bufferPos = {0, 0};

  // main loop
  while (window.isOpen()) {
    // event loop
    while (const std::optional event = window.pollEvent()) {
      // close window on close event
      if (event->is<sf::Event::Closed>())
        window.close();

      if (const auto *resized = event->getIf<sf::Event::Resized>())
        window.setSize(resized->size);

      // close window on escape key pressed
      if (event->is<sf::Event::KeyPressed>()) {
        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Key::Escape))
          window.close();

        // call change color mode on key pressed (C)
        // if (sf::Keyboard::isKeyPressed(sf::Keyboard::Key::C))
        //   particles.change_draw_mode();
      }
    }
    // update delta time
    deltaTime = clock.restart().asSeconds();
    mTime += deltaTime;

    // move view using sin and cos functions
    //  multiply by delta time to make it framerate independen
    bufferPos.x += deltaTime;
    bufferPos.y += deltaTime;

    // update view

    // update text counter
    ss << "FPS: " + std::to_string((int)(1.f / deltaTime));
    //  << "\nParticles: " + std::to_string(particles.get_size())
    //   << "\nEmitter[0] lifetime: " +
    //         std::to_string(particles.get_zeroEmitterLifeTime())
    //  << "\nParticle[0] alpha: " + std::to_string(particles.get_alpha())
    //  << "\nDraw mode:\t" + particles.get_draw_mode();

    m_fps.setString(ss.str());
    ss.str("");

    // make the particle system emitter follow the mouse
    sf::Vector2i mouse = sf::Mouse::getPosition(window);
    //  particles.setEmitter(window.mapPixelToCoords(mouse));

    // update particle system
    // particles.update(deltaTime);

    shdr.setUniform("u_time", mTime);
    shdr.setUniform("u_resolution", sf::Vector2f(window.getSize()));
    // shdr.setUniform("u_texture", t_holder);
    // shdr.setUniform("u_mouse", sf::Vector2f(mouse));

    // set view
    // draw it
    window.clear();
    window.draw(shape, &shdr);
    window.draw(m_fps);
    window.display();
  }

  return 0;
}