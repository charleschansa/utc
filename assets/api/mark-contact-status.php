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

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id']) || !isset($input['is_contacted'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields: id and is_contacted']);
        exit;
    }

    $id = (int)$input['id'];
    $is_contacted = (int)$input['is_contacted'];

    $db = utc_db();
    
    $stmt = $db->prepare('UPDATE contact_inquiries SET is_contacted = ? WHERE id = ?');
    $stmt->execute([$is_contacted, $id]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Contact inquiry not found']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Contact status updated successfully',
        'id' => $id,
        'is_contacted' => $is_contacted
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to update contact status: ' . $e->getMessage()
    ]);
}
