<?php
// ===============================
// SHOW ERRORS (FOR TESTING ONLY)
// ===============================
ini_set('display_errors', 1);
error_reporting(E_ALL);

// ===============================
// DATABASE CONFIG
// ===============================
$host = "localhost";
$port = "3306";
$dbname = "utcsaco3_"; // ⚠️ REPLACE with full DB name
$username = "utcsaco3";
$password = "Chiko@1985"; // ⚠️ PUT YOUR REAL PASSWORD

try {
    // ===============================
    // CONNECT TO DATABASE
    // ===============================
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
    $conn = new PDO($dsn, $username, $password);

    // SET ERROR MODE
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "<h2>✅ Database Connected Successfully</h2>";

    // ===============================
    // CREATE TEST TABLE
    // ===============================
    $createTableSQL = "
        CREATE TABLE IF NOT EXISTS test_table (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ";

    $conn->exec($createTableSQL);
    echo "<p>✅ Test table created or already exists</p>";

    // ===============================
    // INSERT TEST DATA
    // ===============================
    $insertSQL = "INSERT INTO test_table (name) VALUES (:name)";
    $stmt = $conn->prepare($insertSQL);

    $testName = "Test Entry " . rand(100, 999);
    $stmt->execute(['name' => $testName]);

    echo "<p>✅ Test data inserted: <strong>$testName</strong></p>";

    // ===============================
    // FETCH DATA
    // ===============================
    $selectSQL = "SELECT * FROM test_table ORDER BY id DESC LIMIT 5";
    $stmt = $conn->query($selectSQL);

    echo "<h3>📊 Latest Records</h3>";
    echo "<table border='1' cellpadding='10'>";
    echo "<tr><th>ID</th><th>Name</th><th>Created At</th></tr>";

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "<tr>
                <td>{$row['id']}</td>
                <td>{$row['name']}</td>
                <td>{$row['created_at']}</td>
              </tr>";
    }

    echo "</table>";

} catch (PDOException $e) {
    echo "<h3>❌ Database Error</h3>";
    echo "<p>" . $e->getMessage() . "</p>";
}
?>