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
}