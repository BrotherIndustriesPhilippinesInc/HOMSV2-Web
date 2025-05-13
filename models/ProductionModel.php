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
}