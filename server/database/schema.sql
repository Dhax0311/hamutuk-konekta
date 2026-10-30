-- HAMUTUK 2.0 Database Schema
-- MySQL 8.0+ compatible

CREATE DATABASE IF NOT EXISTS `hamutuk_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `hamutuk_db`;

-- 1. USERS & ROLES
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('ADMIN', 'MUNICIPAL_COORDINATOR', 'SUCO_OFFICER') NOT NULL DEFAULT 'SUCO_OFFICER',
  `administrative_area` VARCHAR(100) NULL,
  `phone` VARCHAR(30) NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. DISASTER REPORTS (With stable client_report_id unique constraint for idempotent sync)
CREATE TABLE IF NOT EXISTS `disaster_reports` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `client_report_id` VARCHAR(100) NOT NULL UNIQUE,
  `category` VARCHAR(50) NOT NULL,
  `municipality` VARCHAR(50) NOT NULL DEFAULT 'Viqueque',
  `administrative_post` VARCHAR(50) NOT NULL,
  `suco` VARCHAR(50) NOT NULL,
  `aldeia` VARCHAR(50) NULL,
  `location_description` TEXT NULL,
  `coordinates` VARCHAR(100) NULL,
  `incident_time` DATETIME NULL,
  `description` TEXT NOT NULL,
  `immediate_needs` JSON NULL,
  `priority` ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'LOW') NOT NULL DEFAULT 'HIGH',
  `reporter_user_id` INT NULL,
  `reporter_role` VARCHAR(50) NOT NULL DEFAULT 'SUCO_OFFICER',
  `reporter_name` VARCHAR(100) NOT NULL,
  `verification_status` ENUM('UNVERIFIED', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'UNVERIFIED',
  `verified_by_user_id` INT NULL,
  `verified_at` DATETIME NULL,
  `follow_up_status` ENUM('PENDING', 'IN_PROGRESS', 'RESOLVED') NOT NULL DEFAULT 'PENDING',
  `follow_up_notes` TEXT NULL,
  `server_ack_at` DATETIME NULL,
  `is_demo` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_post_suco` (`administrative_post`, `suco`),
  INDEX `idx_priority` (`priority`),
  INDEX `idx_category` (`category`),
  CONSTRAINT `fk_report_user` FOREIGN KEY (`reporter_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_report_verifier` FOREIGN KEY (`verified_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. COMMUNITY NEEDS
CREATE TABLE IF NOT EXISTS `community_needs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `client_need_id` VARCHAR(100) NULL UNIQUE,
  `category` VARCHAR(50) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `quantity` VARCHAR(150) NOT NULL,
  `urgency` ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'LOW') NOT NULL DEFAULT 'HIGH',
  `status` ENUM('PENDING', 'IN_PROGRESS', 'RESOLVED') NOT NULL DEFAULT 'PENDING',
  `notes` TEXT NULL,
  `is_demo` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_urgency` (`urgency`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. OFFICIAL WARNINGS (Civil Protection & DNMG)
CREATE TABLE IF NOT EXISTS `official_warnings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `source` VARCHAR(150) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'METEOROLOGICAL',
  `severity` ENUM('WARNING', 'CAUTION', 'ADVISORY') NOT NULL DEFAULT 'WARNING',
  `target_area` VARCHAR(150) NOT NULL,
  `issued_at` DATETIME NOT NULL,
  `valid_until` DATETIME NULL,
  `verification_status` VARCHAR(50) NOT NULL DEFAULT 'OFFICIALLY_VERIFIED',
  `dissemination_status` VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  `description` TEXT NOT NULL,
  `created_by_user_id` INT NULL,
  `is_demo` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_warn_creator` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. SITEWATCH SITES (Simulation Telemetry)
CREATE TABLE IF NOT EXISTS `sitewatch_sites` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `post` VARCHAR(50) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `status` ENUM('ONLINE', 'STALE', 'UNREACHABLE', 'UNKNOWN') NOT NULL DEFAULT 'ONLINE',
  `ip_address` VARCHAR(50) NOT NULL,
  `connection_type` VARCHAR(100) NOT NULL,
  `last_heartbeat` DATETIME NOT NULL,
  `uptime_percentage` VARCHAR(10) NOT NULL DEFAULT '99.0%',
  `operator_notes` TEXT NULL,
  `open_tickets` INT NOT NULL DEFAULT 0,
  `is_simulation` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. SITEWATCH HEARTBEATS (Audit / History)
CREATE TABLE IF NOT EXISTS `sitewatch_heartbeats` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `site_id` VARCHAR(50) NOT NULL,
  `status` VARCHAR(20) NOT NULL,
  `latency_ms` INT NULL,
  `received_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_hb_site` FOREIGN KEY (`site_id`) REFERENCES `sitewatch_sites` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
