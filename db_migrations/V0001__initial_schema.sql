-- Create site settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    site_name VARCHAR(255) NOT NULL DEFAULT 'GenLeveling',
    site_description TEXT NOT NULL DEFAULT 'Профессиональная прокачка аккаунтов Henshin Impact',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create services table (прокачка аккаунтов)
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    price VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table (заявки)
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    service_id INTEGER REFERENCES services(id),
    phone VARCHAR(50) NOT NULL,
    game_uid VARCHAR(100) NOT NULL,
    telegram VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default site settings
INSERT INTO site_settings (site_name, site_description) 
VALUES ('GenLeveling', 'Профессиональная прокачка аккаунтов Henshin Impact');

-- Insert sample services
INSERT INTO services (title, description, requirements, price) VALUES
('Прокачка до AR 30', 'Быстрая прокачка вашего аккаунта до уровня приключений 30. Гарантия качества и безопасности.', 'AR уровень: 1-20, Email доступ, 2FA отключен', '1500 ₽'),
('Прокачка до AR 45', 'Прокачка аккаунта до AR 45 с выполнением квестов и открытием локаций.', 'AR уровень: 20-35, Email доступ, Активный аккаунт', '2500 ₽'),
('Прокачка до AR 55', 'Максимальная прокачка аккаунта с фармом артефактов и оружия.', 'AR уровень: 35+, Email доступ, Достаточно смолы', '4000 ₽'),
('Фарм материалов', 'Сбор необходимых материалов для прокачки персонажей и оружия.', 'AR 16+, Указать список материалов, Доступ к аккаунту', '800 ₽');