CREATE TABLE IF NOT EXISTS contact_inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL,
  organization VARCHAR(190) NOT NULL,
  service VARCHAR(190) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contact_inquiries_email (email),
  INDEX idx_contact_inquiries_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS training_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  source VARCHAR(120) NOT NULL DEFAULT 'manual',
  course_name VARCHAR(255) DEFAULT NULL,
  course_date VARCHAR(120) DEFAULT NULL,
  course_location VARCHAR(255) DEFAULT NULL,
  course_duration VARCHAR(120) DEFAULT NULL,
  company_name VARCHAR(190) NOT NULL,
  company_address TEXT,
  company_phone VARCHAR(60),
  company_email VARCHAR(190) NOT NULL,
  delegate_count VARCHAR(30) NOT NULL,
  package_selection VARCHAR(60) NOT NULL,
  table_count INT DEFAULT NULL,
  manager_name VARCHAR(190) NOT NULL,
  manager_email VARCHAR(190) NOT NULL,
  manager_phone VARCHAR(60),
  manager_designation VARCHAR(190),
  terms_accepted TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_training_registrations_company_email (company_email),
  INDEX idx_training_registrations_course_name (course_name),
  INDEX idx_training_registrations_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
