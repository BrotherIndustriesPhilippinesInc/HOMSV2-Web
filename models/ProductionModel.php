<?php 
require_once __DIR__ . "/Model.php";

class ProductionModel extends Model
{
    public function __construct() {
        parent::__construct();
    }

    protected function getTableName(): string {
        return "production_records";
    }

    public function getHistory($data){
        $section = $data['section'];

        return $this->executePrepared(
            "SELECT DISTINCT(time_created::date), work_center  
            FROM public.production_records 
            WHERE section = :section",
            ['section' => $section],
            "all"
        );
    }

    public function getSectionHistory($data){
        $section = $data['section'];
        $po = $data['po'];
        
        return $this->executePrepared(
            "SELECT *
            FROM public.production_records 
            WHERE section = :section AND po = :po",
            ['section' => $section, "po" => $po],
            "all"
        );
    }

    public function updateActualQuantityViaESPModel($id, $data){
        date_default_timezone_set('Asia/Manila');

        if (!is_numeric($id)) {
            throw new Exception("Invalid ID");
        }
    
        $table = $this->getTableName();
        $this->validateTableName($table);
    
        if (!isset($data['time_created'])) {
            $data['time_created'] = date('Y-m-d H:i:s'); // Current timestamp
        }

        // 🔄 Remap fields for update context
        $data = $this->remapForUpdate($data);
    
        $fields = implode(", ", array_map(fn($key) => "$key = :$key", array_keys($data)));
    
        $sql = "UPDATE {$table} SET {$fields} WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
    
        $data['id'] = (int)$id;
        $stmt->execute($this->sanitizeData($data));
    
        return ["status" => "success"];
    }
}