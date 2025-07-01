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
        $date = $data['date'];
        
        return $this->executePrepared(
            "SELECT *
            FROM public.production_records 
            WHERE section = :section AND po = :po AND time_created::date = :date",
            ['section' => $section, "po" => $po, "date" => $date],
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

    public function getHOData(){
        /*  WITH start_rows AS (
                SELECT *
                FROM production_records
                WHERE production_action = 'start'
            ),
            end_rows AS (
                SELECT *
                FROM production_records
                WHERE production_action = 'end'
            )
            SELECT
                EXTRACT(EPOCH FROM (e.end_time - s.start_time)) / 60 AS duration_minutes,
                s.id AS start_id,
                e.id AS end_id,
                s.po,
                s.line_name,
                s.material,
                s.description,
                s.work_center,
                s.start_time,
                e.end_time,
                e.actual_quantity,
                e.variance,
                e.advance_reasons,
                e.linestop_reasons,
                s.creator,
                s.time_created,
                e.time_updated,
                s.compliance_rate,
                e.hourly_plan,
                e.target
            FROM start_rows s
            JOIN end_rows e
                ON s.creator = e.creator
                AND s.po = e.po
                AND s.material = e.material
                AND s.line_name = e.line_name
            WHERE
                s.work_center = 'W202L1' -- 🎯 your target work center
                AND DATE(s.start_time) = '2025-06-18' -- 📅 filter by exact date
            ORDER BY s.start_time;
            */
    }

}