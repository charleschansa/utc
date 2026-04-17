<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $db = utc_db();

    $db->exec(
        'CREATE TABLE IF NOT EXISTS contact_inquiries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            email VARCHAR(190) NOT NULL,
            organization VARCHAR(190) NOT NULL,
            service VARCHAR(190) NOT NULL,
            message TEXT NOT NULL,
            is_contacted TINYINT(1) NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_contact_inquiries_email (email),
            INDEX idx_contact_inquiries_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );
    
    // Add is_contacted column if it doesn't exist (for existing tables)
    try {
        $db->exec('ALTER TABLE contact_inquiries ADD COLUMN is_contacted TINYINT(1) NOT NULL DEFAULT 0');
    } catch (Throwable $e) {
        // Column already exists
    }

    $db->exec(
        'CREATE TABLE IF NOT EXISTS training_registrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            source VARCHAR(120) NOT NULL DEFAULT "manual",
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $stats = [
        'contact_total' => (int)$db->query('SELECT COUNT(*) FROM contact_inquiries')->fetchColumn(),
        'training_total' => (int)$db->query('SELECT COUNT(*) FROM training_registrations')->fetchColumn(),
        'contact_today' => (int)$db->query('SELECT COUNT(*) FROM contact_inquiries WHERE DATE(created_at) = CURDATE()')->fetchColumn(),
        'training_today' => (int)$db->query('SELECT COUNT(*) FROM training_registrations WHERE DATE(created_at) = CURDATE()')->fetchColumn(),
    ];

    $contactRows = $db->query(
        'SELECT id, name, email, organization, service, message, is_contacted, created_at
         FROM contact_inquiries
         ORDER BY id DESC
         LIMIT 200'
    )->fetchAll(PDO::FETCH_ASSOC);

    $trainingRows = $db->query(
        'SELECT id, source, course_name, course_date, course_location, course_duration,
                company_name, company_email, delegate_count, package_selection, table_count,
                manager_name, manager_email, created_at
         FROM training_registrations
         ORDER BY id DESC
         LIMIT 200'
    )->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'stats' => $stats,
        'contactRows' => $contactRows,
        'trainingRows' => $trainingRows,
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to load dashboard data. Check database connection and table permissions.'
    ]);
}
