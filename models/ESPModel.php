<?php 
require_once __DIR__ . "/Model.php";

class ESPModel extends Model
{
    public function __construct() {
        parent::__construct();
    }

    protected function getTableName(): string {
        return "esp_management";
    }

    public function getESPDistictMacAddress($section){
        return $this->executePrepared(
            "SELECT DISTINCT esp_name, mac_address FROM public.esp_management WHERE assigned_section = :section AND isrunning = false",
            ['section' => $section],
            "all"
        );
    }
}