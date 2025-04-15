<?php 

class MSQLServer
{
    private $serverName = "APBIPHBPSDB02";
    private $database = "Centralized_LOGIN_DB";
    private $username = "CAS_access"; // or your SQL user
    private $password = "@BIPH2024";
    private $conn;
    
    public function __construct()
    {
        try {
            $this->conn = new PDO(
                "sqlsrv:Server=$this->serverName;Database=$this->database",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
        } catch (PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }

    public function getConnection()
    {
        return $this->conn;
    }

    // Close connection
    public function closeConnection()
    {
        $this->conn = null;
        echo "Connection closed!";
    }

    public function query($sql, $params = [])
    {
        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll(PDO::FETCH_ASSOC); // Return result as an associative array
        } catch (PDOException $e) {
            die("Query failed: " . $e->getMessage());
        }
    }

    public function execute($sql, $params = [])
    {
        try {
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute($params); // Returns true on success, false on failure
        } catch (PDOException $e) {
            die("Execution failed: " . $e->getMessage());
        }
    }

    public function getUser(string $where){
        try {
            $data = $this->query("SELECT * FROM tbl_EMSVIEW $where");
            return $data;

        }catch (PDOException $e) {
            die("Query failed: " . $e->getMessage());
        }
        
    }

}
