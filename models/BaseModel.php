<?php 
class BaseModel
{
    private $dbhost = '10.248.1.152';
    private $dbname = 'HOMS_V2';
    private $dbuser = 'postgres';
    private $dbpass = '1234';

    public function __construct() {
        // Initialize properties
        $this->host = $this->dbhost;
        $this->name = $this->dbname;
        $this->user = $this->dbuser;
        $this->password = $this->dbpass;
    }

    /**
     * Checks the connection to the PostgreSQL database.
     *
     * @throws PDOException if the connection fails
     * @return void
     */
    public function CheckConnection() {
        try {
            // Connect to PostgreSQL database
            $dbh = new PDO("pgsql:host=$this->dbhost;dbname=$this->dbname", $this->dbuser, $this->dbpass);
            // Set PDO error mode to exception
            $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            echo "Connected successfully";
        } catch (PDOException $e) {
            // Display error message if connection fails
            echo "Connection Failed: " . $e->getMessage();
        }
    }
    /**
     * Establishes a connection to a PostgreSQL database using PDO.
     *
     * @return PDO The PDO object representing the database connection.
     * @throws Exception If the connection fails.
     */
    public function Connection(): PDO {
        try {
            $dbh = new PDO("pgsql:host=$this->dbhost;dbname=$this->dbname", $this->dbuser, $this->dbpass);
            $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            throw new Exception("Connection Failed: " . $e->getMessage());
        }
        return $dbh;
    }
    
    /**
     * Inserts data into a PostgreSQL table.
     *
     * @param string $TableName The name of the table to insert into.
     * @param array $AssociativeData An associative array of column names and their corresponding values.
     * @throws Exception If the insertion fails.
     * @return void
     */
    public function PostgresqlInsert(string $TableName, array $AssociativeData){
        $columnsArr = [];
        $placeholdersArr = [];

        foreach ($AssociativeData as $column => $value) {
            $columnsArr[] = $column;
            $placeholdersArr[] = ":$column";
        }

        $columns = implode(', ', $columnsArr);
        $placeholders = implode(', ', $placeholdersArr);

        try {
            $pdo = $this->Connection();
            $query = $pdo->prepare("INSERT INTO $TableName ($columns) VALUES ($placeholders)");
            
            // Bind each value to its placeholder
            foreach ($AssociativeData as $column => $value) {
                // Handle boolean values explicitly
                if (is_null($value)) {
                    $query->bindValue(":$column", null, PDO::PARAM_NULL);
                } elseif (is_bool($value)) {
                    $query->bindValue(":$column", $value, PDO::PARAM_BOOL);
                } else {
                    $query->bindValue(":$column", $value);
                }
            }
            
            // Execute the prepared statement
            $query->execute();
        } catch (PDOException $e) {
            throw new Exception("Insertion Failed: " . $e->getMessage());
        }
    }
    /**
     * Executes a PostgreSQL SELECT query with optional parameters.
     *
     * @param string $TableName The name of the table to select from.
     * @param string $Columns (optional) The columns to select. Defaults to '*'.
     * @param string $Condition (optional) The WHERE clause for filtering the rows.
     * @param int $Limit (optional) The maximum number of rows to return. Defaults to 50.
     * @param int $Offset (optional) The number of rows to skip before returning results. Defaults to 0.
     * @param string $Order (optional) The ORDER BY clause for sorting the rows. EXAMPLE(id ASC);
     * @return array An array of associative arrays representing the selected rows.
     * @throws Exception If the selection fails.
     */
    public function PostgresqlSelect(string $TableName, string $Columns = '*' ,string $Condition = '', int $Limit = 0, int $Offset = 0, string $Order ='') {
        $pdo = $this->Connection();
        $sql = "SELECT $Columns FROM $TableName";
        
        if ($Condition != '') {
            $sql .= " WHERE $Condition";
        }

        if ($Order != '') {
            $sql .= " ORDER BY $Order";
        }
        
        if ($Limit != '' AND $Limit != 0) {
            $sql .= " LIMIT $Limit";
        }
        if ($Offset != '' AND $Offset != 0) {
            $sql .= " OFFSET $Offset";
        }

        try {
            $query = $pdo->prepare($sql);

            $query->execute();
            return $query->fetchAll(PDO::FETCH_ASSOC);

        } catch (PDOException $e) {
            var_dump($e->getMessage());
            throw new Exception("Selection Failed: " . $e->getMessage());
        }
    }
    /**
     * Updates a PostgreSQL table with the provided associative data.
     *
     * @param string $TableName The name of the table to update.
     * @param array $AssociativeData An array of column names and their corresponding values to update.
     * @param string $Condition The WHERE clause for filtering the rows to update.
     * @param array $ColumnException An optional array of column names to exclude from the update.
     * @throws Exception If the update fails.
     * @return array The updated associative data.
     */
    public function PostgresqlUpdate(string $TableName, array $AssociativeData, string $Condition, array $ColumnException = []): array {
        $setClauseArr = [];
    
        // Remove exception columns from the data
        if ($ColumnException) {
            foreach ($ColumnException as $key => $value) {
                unset($AssociativeData[$value]);
            }
        }
    
        // Convert all column names to lowercase
        $lowercaseAssociativeData = [];
        foreach ($AssociativeData as $column => $value) {
            $lowercaseAssociativeData[strtolower($column)] = $value;
        }
    
        // Build the SET clause
        foreach ($lowercaseAssociativeData as $column => $value) {
            $setClauseArr[] = "\"$column\" = :$column";
        }
    
        $setClause = implode(', ', $setClauseArr);
    
        try {
            $pdo = $this->Connection();
            $sql = "UPDATE $TableName SET $setClause";
            if ($Condition != '') {
                $sql .= " WHERE $Condition";
            }
            $query = $pdo->prepare($sql);
    
            // Bind each value to its placeholder, converting to integer if necessary
            foreach ($lowercaseAssociativeData as $column => $value) {
                // Check if the value is a string that represents an integer
                if (is_string($value) && ctype_digit($value)) {
                    $value = (int)$value;
                }
    
                // Use bindValue with explicit type
                if (is_int($value)) {
                    $query->bindValue(":$column", $value, PDO::PARAM_INT);
                } else {
                    $query->bindValue(":$column", $value, PDO::PARAM_STR);
                }
            }
    
            // Execute the prepared statement
            $query->execute();
            return $lowercaseAssociativeData;
        } catch (PDOException $e) {
            throw new Exception("Update Failed: " . $e->getMessage());
        }
    }
    /**
     * Updates a row in a PostgreSQL table based on the provided data and conditions.
     *
     * @param string $TableName The name of the table to update.
     * @param array $AssociativeData An associative array of column names and their corresponding values.
     * @param string $Where The WHERE clause for filtering the rows to update.
     * @throws Exception If the update fails.
     * @return void
     */
    public function PostgresqlDelete(string $TableName, string $Where) {
        try {
            $pdo = $this->Connection();
            $sql = "DELETE FROM $TableName WHERE $Where";
            $query = $pdo->prepare($sql);
            $query->execute();

        } catch (PDOException $e) {
            throw new Exception("Deletion Failed: " . $e->getMessage());
        }
    }
}
