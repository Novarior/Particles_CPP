// particle system v0.1 by Novarior

#ifndef PARTICLE_HPP
#define PARTICLE_HPP

#include "headers.hpp"

class ParticleSystem : public sf::Drawable, public sf::Transformable {
public:
    ParticleSystem(unsigned int count, sf::Vector2f size_window)
        : m_particles(count)
        , m_vertices(sf::Points, count)
        , m_lifetime(5.f)
        , m_emitter(0.f, 0.f)
        , m_size_window(size_window / 2.f)
    {
        m_draw_mode = 0;
    }

    void setEmitter(sf::Vector2f position)
    {
        m_emitter = position;
        // m_emitter = m_size_window;
    }

    float get_zeroEmitterLifeTime() const
    {
        return m_particles[0].lifetime;
    }

    // get count size
    size_t get_size() const { return m_particles.size(); }

    // get alpha of particle[0]
    sf::Uint8 get_alpha() const { return m_vertices[0].color.a; }

    void update(float elapsed)
    {
        for (std::size_t i = 0; i < m_particles.size(); ++i) {
            // update the particle lifetime
            Particle& p = m_particles[i];
            p.lifetime -= elapsed;

            // if the particle is dead, respawn it
            if (p.lifetime <= 0.f)
                resetParticle(i);

            // update the position of the corresponding vertex
            m_vertices[i].position += p.velocity * elapsed;

            // update the alpha (transparency) of the particle according to its lifetime
            float ratio = 3 * m_particles[i].lifetime / m_lifetime;

            // update color
            float r = 255 * sin(ratio * M_PI);
            float g = 255 * sin(ratio * M_PI + (2 * M_PI / 3));
            float b = 255 * sin(ratio * M_PI + (M_PI / 0.3));

            // use m_draw_mode for change color mode
            // 0 - normal, 1 - revers color (if rgb<0, then rgb=-rgb)
            // 2 - only red, 3 - only green, 4 - only blue,
            //  5 - red and green, 6 - red and blue, 7 - green and blue,
            // 8 using positive half of sin (if rgb<0, then rgb=0)
            // reverse color

            // draw red color if mode 0, 1, 2, 5, 6, 8
            if (m_draw_mode == 0 || m_draw_mode == 1 || m_draw_mode == 2 || m_draw_mode == 5 || m_draw_mode == 6 || m_draw_mode == 8) {
                if (r < 0 && m_draw_mode == 1)
                    r = -r;
                else if (r < 0 && m_draw_mode == 8)
                    r = 0;
                m_vertices[i].color.r = static_cast<sf::Uint8>(r);
            } else if (m_draw_mode == 3 || m_draw_mode == 4 || m_draw_mode == 7) {
                m_vertices[i].color.r = 0;
            }

            // draw green color if mode 0, 1, 3, 5, 7, 8
            if (m_draw_mode == 0 || m_draw_mode == 1 || m_draw_mode == 3 || m_draw_mode == 5 || m_draw_mode == 7 || m_draw_mode == 8) {
                if (g < 0 && m_draw_mode == 1)
                    g = -g;
                if (g < 0 && m_draw_mode == 8)
                    g = 0;
                m_vertices[i].color.g = static_cast<sf::Uint8>(g);
            } else if (m_draw_mode == 2 || m_draw_mode == 4 || m_draw_mode == 6) {
                m_vertices[i].color.g = 0;
            }

            // draw blue color if mode 0, 1, 4, 6, 7, 8
            if (m_draw_mode == 0 || m_draw_mode == 1 || m_draw_mode == 4 || m_draw_mode == 6 || m_draw_mode == 7 || m_draw_mode == 8) {
                if (b < 0 && m_draw_mode == 1)
                    b = -b;
                if (b < 0 && m_draw_mode == 8)
                    b = 0;
                m_vertices[i].color.b = static_cast<sf::Uint8>(b);
            } else if (m_draw_mode == 2 || m_draw_mode == 3 || m_draw_mode == 5) {
                m_vertices[i].color.b = 0;
            }

            // reverse alpha
            m_vertices[i].color.a = static_cast<sf::Uint8>(255 - (255 * sin(M_PI + ratio * M_PI)) - 255);
        }
    }

    void change_draw_mode()
    {
        m_draw_mode++;
        if (m_draw_mode > 8)
            m_draw_mode = 0;
    }

    u_char get_draw_mode_dig() const { return m_draw_mode; }

    std::string get_draw_mode() const
    {
        // switch case m_draw_mode
        // return string with mode number and description

        // use m_draw_mode for change color mode
        // 0 - normal, 1 - revers color if rgb<0 (unic for all color)
        // 2 - only red, 3 - only green, 4 - only blue,
        //  5 - red and green, 6 - red and blue, 7 - green and blue,
        // 8 using positive half of sin (if rgb<0, then rgb=0)

        switch (m_draw_mode) {
        case 0:
            return "0\tnormal";
            break;
        case 1:
            return "1\trevers color (if rgb<0, then rgb=-rgb)";
            break;
        case 2:
            return "2\tonly red";
            break;
        case 3:
            return "3\tonly green";
            break;
        case 4:
            return "4\tonly blue";
            break;
        case 5:
            return "5\tred and green";
            break;
        case 6:
            return "6\tred and blue";
            break;
        case 7:
            return "7\tgreen and blue";
            break;
        case 8:
            return "8\tusing positive half of sin (if rgb<0, then rgb=0)";
            break;
        default:
            return "0\t\e[31m\tERROR\e[0m";
            break;
        }
    }

private:
    virtual void draw(sf::RenderTarget& target, sf::RenderStates states) const
    {
        // apply the transform
        states.transform *= getTransform();

        // our particles don't use a texture
        states.texture = NULL;

        // draw the vertex array
        target.draw(m_vertices, states);
    }

private:
    struct Particle {
        sf::Vector2f velocity;
        float lifetime;
        float m_time;
    };

    void resetParticle(std::size_t index)
    {
        // give a random velocity and lifetime to the particle
        float angle = (std::rand() % 2880) * M_PI / 1440.f;
        float speed = (std::rand() % 100);

        m_particles[index].velocity = sf::Vector2f(std::cos(angle) * speed, std::sin(angle) * speed);
        m_particles[index].lifetime = ((std::rand() % 4000) + 1000) / 500.f;
        m_particles[index].m_time = m_particles[index].lifetime;

        // reset the position of the corresponding vertex
        m_vertices[index].position = m_emitter;
    }
    sf::Vector2f m_size_window;
    std::vector<Particle> m_particles;
    sf::VertexArray m_vertices;
    float m_lifetime;
    sf::Vector2f m_emitter;
    u_char m_draw_mode;
};

#endif /* PARTICLE_HPP */