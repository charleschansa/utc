<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');

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

$validPackages = ['Standard (R1,800)', 'VIP (R2,500)', 'Table (R16,000)'];
if (!in_array($packageSelection, $validPackages, true)) {
    $errors[] = 'Valid Package Selection is required';
}

if ($packageSelection === 'Table (R16,000)') {
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
    $dataDir = __DIR__ . '/data';
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0775, true);
    }

    $dbPath = $dataDir . '/registrations.sqlite';
    $db = new PDO('sqlite:' . $dbPath);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $db->exec(
        'CREATE TABLE IF NOT EXISTS gala_registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_name TEXT NOT NULL,
            company_address TEXT,
            company_phone TEXT,
            company_email TEXT NOT NULL,
            delegate_count TEXT NOT NULL,
            package_selection TEXT NOT NULL,
            table_count INTEGER,
            manager_name TEXT NOT NULL,
            manager_email TEXT NOT NULL,
            manager_phone TEXT,
            manager_designation TEXT,
            terms_accepted INTEGER NOT NULL,
            created_at TEXT NOT NULL
        )'
    );

    $stmt = $db->prepare(
        'INSERT INTO gala_registrations (
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

$adminTo = 'hr.gala@utc-sa.co.za';
$subject = 'New HR Gala Registration';

$emailBody = "A new HR Gala registration has been submitted.\n\n";
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

$userSubject = 'HR Gala Registration Received';
$userBody = "Thank you for registering for The HR Leadership Gala 2026.\n\n";
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
