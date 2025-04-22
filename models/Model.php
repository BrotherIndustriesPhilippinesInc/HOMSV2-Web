<?php
require_once __DIR__ . '/../interfaces/IModel.php';

abstract class Model implements IModel {
    protected PDO $conn;
    private static array $allowedTables = ['pol', 'test_table', 'pt_pol', 'tc_pol']; // ✅ Prevents SQL Injection
    private static string $host = '10.248.1.152';
    private static string $username = 'postgres';
    private static string $password = '1234';
    private static string $database = 'HOMS_V2';

    public function __construct() {
        try {
            // Use environment variables with fallback to hardcoded defaults
            $host = getenv('DB_HOST') ?: self::$host;
            $dbname = getenv('DB_NAME') ?: self::$database;
            $user = getenv('DB_USER') ?: self::$username;
            $password = getenv('DB_PASSWORD') ?: self::$password;

            // ✅ Corrected DSN format
            $dsn = "pgsql:host=$host;dbname=$dbname";
            $this->conn = new PDO($dsn, $user, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // ✅ Enable exception handling
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC // ✅ Fetch as associative array
            ]);

        } catch (PDOException $e) {
            error_log("Database Error: " . $e->getMessage()); // ✅ Log errors instead of exposing them
            die("Database connection failed. Please contact the administrator.");
        }
    }

    abstract protected function getTableName(): string;

    protected function validateTableName(string $table): void {
        if (!in_array($table, self::$allowedTables)) {
            throw new Exception("Invalid table name!");
        }
    }

    public function insert(array $data) {
        $table = $this->getTableName();
        $this->validateTableName($table); // ✅ Secure table name

        $columns = implode(", ", array_keys($data));
        $placeholders = ":" . implode(", :", array_keys($data));

        $sql = "INSERT INTO {$table} ({$columns}) VALUES ({$placeholders})";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute($this->sanitizeData($data));
    }

    public function getAll() {
        $table = $this->getTableName();
        $this->validateTableName($table);

        $stmt = $this->conn->query("SELECT * FROM {$table} ORDER BY id ASC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function get(string $where) {

        $table = $this->getTableName();
        $this->validateTableName($table);

        $stmt = $this->conn->prepare("SELECT * FROM {$table} WHERE $where ORDER BY id DESC");
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function update($id, array $data) {
        if (!is_numeric($id)) throw new Exception("Invalid ID");

        $table = $this->getTableName();
        $this->validateTableName($table);

        $fields = implode(", ", array_map(fn($key) => "$key = :$key", array_keys($data)));

        $sql = "UPDATE {$table} SET {$fields} WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        $data['id'] = (int)$id;
        $stmt->execute($this->sanitizeData($data));
        return ["status" => "success"];
    }

    public function partialUpdate($id, array $data) {
        if (!is_numeric($id)) throw new Exception("Invalid ID");
        if (empty($data)) throw new Exception("No data to update");

        $table = $this->getTableName();
        $this->validateTableName($table);

        $fields = implode(", ", array_map(fn($key) => "$key = :$key", array_keys($data)));

        $sql = "UPDATE {$table} SET {$fields} WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        $data['id'] = (int)$id;
        return $stmt->execute($this->sanitizeData($data));
    }

    public function delete($id) {
        if (!is_numeric($id)) throw new Exception("Invalid ID");

        $table = $this->getTableName();
        $this->validateTableName($table);

        $stmt = $this->conn->prepare("DELETE FROM {$table} WHERE id = :id");
        return $stmt->execute(['id' => (int)$id]);
    }

    public function deleteAll() {
        $table = $this->getTableName();
        $this->validateTableName($table);

        $stmt = $this->conn->prepare("DELETE FROM {$table}");
        return $stmt->execute();
    }

    private function sanitizeData(array $data): array {
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $data[$key] = htmlspecialchars(strip_tags($value));
            } elseif (is_array($value)) {
                $data[$key] = json_encode($value); // or implode(',', $value) if needed
            } elseif ($value instanceof DateTime) {
                $data[$key] = $value->format('Y-m-d H:i:s'); // normalize datetime
            }
        }
        return $data;
    }
    
    public function runSqlServerViews(string $serverName, array $connectionOptions, string $viewName) {
        try {

            // ✅ Establish SQL Server connection
            $conn = sqlsrv_connect($serverName, $connectionOptions);
            if (!$conn) {
                throw new Exception("SQL Server Connection Failed: " . print_r(sqlsrv_errors(), true));
            }
    
            // ✅ Prepare and Execute Query
            $sql = "SELECT * FROM " . $viewName;
            $stmt = sqlsrv_query($conn, $sql);
    
            if ($stmt === false) {
                throw new Exception("SQL Query Error: " . print_r(sqlsrv_errors(), true));
            }
    
            // ✅ Fetch Results
            $results = [];
            while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
                $results[] = $row;
            }
    
            // ✅ Clean up resources
            sqlsrv_free_stmt($stmt);
            sqlsrv_close($conn);
    
            return $results; // ✅ Return results instead of printing them
    
        } catch (Exception $e) {
            error_log("SQLSRV Error: " . $e->getMessage()); // ✅ Log errors securely
            die("Database query failed. Please contact the administrator."); // ✅ Prevent exposing sensitive errors
        }
    }
}
