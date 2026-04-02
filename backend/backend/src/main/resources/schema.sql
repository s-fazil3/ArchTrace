-- Manual schema initialization for esa_db
CREATE TABLE IF NOT EXISTS teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    team_lead VARCHAR(255),
    color VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    team VARCHAR(255) NOT NULL,
    tech VARCHAR(255),
    endpoint VARCHAR(255),
    version VARCHAR(255),
    status VARCHAR(255) DEFAULT 'Healthy',
    dependencies_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50),
    team VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS dependencies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    source VARCHAR(255) NOT NULL,
    target VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    risk VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(255),
    target VARCHAR(255),
    user_name VARCHAR(255),
    type VARCHAR(50),
    `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP
);
