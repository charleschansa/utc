<?php
// Contact Form Email Handler
// Validates input, sends email, returns JSON response

require_once __DIR__ . '/db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get form data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$organization = isset($_POST['organization']) ? trim($_POST['organization']) : '';
$service = isset($_POST['service']) ? trim($_POST['service']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validate required fields
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email is required';
}

if (empty($organization)) {
    $errors[] = 'Organization is required';
}

if (empty($service)) {
    $errors[] = 'Service selection is required';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Message must be at least 10 characters';
}

// Return validation errors
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Sanitize inputs
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email = filter_var($email, FILTER_SANITIZE_EMAIL);
$organization = htmlspecialchars($organization, ENT_QUOTES, 'UTF-8');
$service = htmlspecialchars($service, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

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
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $stmt = $db->prepare(
        'INSERT INTO contact_inquiries (name, email, organization, service, message) VALUES (:name, :email, :organization, :service, :message)'
    );

    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':organization' => $organization,
        ':service' => $service,
        ':message' => $message,
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to save inquiry. Please try again or contact us directly.'
    ]);
    exit;
}

// Prepare email content
$to = 'info@utc-sa.co.za';
$subject = "New Consultation Request from {$name}";
$body = "You have received a new consultation request from the website.\n\n";
$body .= "Name: {$name}\n";
$body .= "Email: {$email}\n";
$body .= "Organization: {$organization}\n";
$body .= "Service: {$service}\n";
$body .= "Message:\n{$message}\n";

$headers = "From: {$email}\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
if (mail($to, $subject, $body, $headers)) {
    // Log successful submission (optional)
    error_log("Contact form submitted by {$email} at " . date('Y-m-d H:i:s'));
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Your inquiry has been sent successfully. We will respond within 24 hours.'
    ]);
} else {
    // Email sending failed
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send email. Please try again or contact us directly.'
    ]);
}
