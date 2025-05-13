<?php 
require_once __DIR__ . "/Model.php";

class POLModel extends Model
{
    private int $id;
    private string $file_name;
    private string $path;
    private DateTime $upload_date;
    private int $uploaded_by;

    private int $size;

    private string $table = "";

    public function __construct() {
        parent::__construct();
    }

    protected function getTableName(): string {
        error_log("Current table name: " . $this->table);
        return $this->table;
    }

    public function setTableName($section){
        $this->table = strtolower($section) . "_pol";
    }

    public function setTableNameNoAppend($section){
        $this->table = strtolower($section);
    }
}