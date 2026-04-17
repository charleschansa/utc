<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

function value($key)
{
    return isset($_POST[$key]) ? trim((string)$_POST[$key]) : '';
}

$source = value('source');
$courseName = value('course_name');
$courseDate = value('course_date');
$courseLocation = value('course_location');
$courseDuration = value('course_duration');
$companyName = value('company_name');
$companyAddress = value('company_address');
$companyPhone = value('company_phone');
$companyEmail = value('company_email');
$delegateCount = value('delegate_count');
$packageSelection = value('package_selection');
$tableCount = value('table_count');
$managerName = value('manager_name');
$managerEmail = value('manager_email');
$managerPhone = value('manager_phone');
$managerDesignation = value('manager_designation');
$termsAccepted = value('terms_accepted');

$errors = [];

if ($companyName === '') {
    $errors[] = 'Company Name is required';
}
if ($companyEmail === '' || !filter_var($companyEmail, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid Company Email is required';
}
if ($delegateCount === '') {
    $errors[] = 'Number of Delegates is required';
}

$validPackages = [
    '1 Day - R3,500 per person',
    '2 Days - R7,500 per person',
    '3 Days - R8,999 per person',
    'Standard Ticket - R1,800.00 per attendee',
    'VIP Ticket - R2,500.00 per attendee',
    'Table Booking - R16,000.00 (Seats 10)',
    'Investment - R13,500.00 per delegate',
    'Standard (R1,800)',
    'VIP (R2,500)',
    'Table (R16,000)'
];
if (!in_array($packageSelection, $validPackages, true)) {
    $errors[] = 'Valid Package Selection is required';
}

if (stripos($packageSelection, 'Table') !== false && $packageSelection !== 'Table (R16,000)') {
    if ($tableCount === '' || !ctype_digit($tableCount) || (int)$tableCount < 1) {
        $errors[] = 'Number of Tables is required for Table package';
    }
}

if ($managerName === '') {
    $errors[] = 'Authorising Manager Name is required';
}
if ($managerEmail === '' || !filter_var($managerEmail, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid Authorising Manager Email is required';
}
if ($termsAccepted !== 'on') {
    $errors[] = 'You must accept the terms and conditions';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

try {
    $db = utc_db();

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
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $stmt = $db->prepare(
        'INSERT INTO training_registrations (
            source,
            course_name,
            course_date,
            course_location,
            course_duration,
            company_name,
            company_address,
            company_phone,
            company_email,
            delegate_count,
            package_selection,
            table_count,
            manager_name,
            manager_email,
            manager_phone,
            manager_designation,
            terms_accepted,
            created_at
        ) VALUES (
            :source,
            :course_name,
            :course_date,
            :course_location,
            :course_duration,
            :company_name,
            :company_address,
            :company_phone,
            :company_email,
            :delegate_count,
            :package_selection,
            :table_count,
            :manager_name,
            :manager_email,
            :manager_phone,
            :manager_designation,
            :terms_accepted,
            :created_at
        )'
    );

    $stmt->execute([
        ':source' => $source,
        ':course_name' => $courseName,
        ':course_date' => $courseDate,
        ':course_location' => $courseLocation,
        ':course_duration' => $courseDuration,
        ':company_name' => $companyName,
        ':company_address' => $companyAddress,
        ':company_phone' => $companyPhone,
        ':company_email' => $companyEmail,
        ':delegate_count' => $delegateCount,
        ':package_selection' => $packageSelection,
        ':table_count' => ($tableCount === '' ? null : (int)$tableCount),
        ':manager_name' => $managerName,
        ':manager_email' => $managerEmail,
        ':manager_phone' => $managerPhone,
        ':manager_designation' => $managerDesignation,
        ':terms_accepted' => 1,
        ':created_at' => date('Y-m-d H:i:s')
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to store registration']);
    exit;
}

$adminTo = 'info@utc-sa.co.za';
$subject = 'New Training Registration Request';

$emailBody = "A new training registration request has been submitted.\n\n";
if ($courseName !== '') {
    $emailBody .= "Course/Program: {$courseName}\n";
}
if ($courseDate !== '') {
    $emailBody .= "Course Date: {$courseDate}\n";
}
if ($courseLocation !== '') {
    $emailBody .= "Course Location: {$courseLocation}\n";
}
if ($courseDuration !== '') {
    $emailBody .= "Course Duration: {$courseDuration}\n";
}
$emailBody .= "Company Name: {$companyName}\n";
$emailBody .= "Company Email: {$companyEmail}\n";
$emailBody .= "Company Phone: {$companyPhone}\n";
$emailBody .= "Number of Delegates: {$delegateCount}\n";
$emailBody .= "Package Selected: {$packageSelection}\n";
if ($packageSelection === 'Table (R16,000)') {
    $emailBody .= "Number of Tables: {$tableCount}\n";
}
$emailBody .= "\nAuthorising Manager Details\n";
$emailBody .= "Name: {$managerName}\n";
$emailBody .= "Email: {$managerEmail}\n";
$emailBody .= "Phone: {$managerPhone}\n";
$emailBody .= "Designation: {$managerDesignation}\n";

$headers = "From: noreply@utc-sa.co.za\r\n";
$headers .= "Reply-To: {$managerEmail}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

@mail($adminTo, $subject, $emailBody, $headers);

$userSubject = 'Training Registration Received';
$userBody = "Thank you for your registration request.\n\n";
if ($courseName !== '') {
    $userBody .= "Course/Program: {$courseName}\n";
}
$userBody .= "Company: {$companyName}\n";
$userBody .= "Delegates: {$delegateCount}\n";
$userBody .= "Package: {$packageSelection}\n\n";
$userBody .= "Our team will contact you shortly with next steps.\n";

@mail($companyEmail, $userSubject, $userBody, $headers);

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Registration submitted successfully. Our team will contact you shortly.'
]);
