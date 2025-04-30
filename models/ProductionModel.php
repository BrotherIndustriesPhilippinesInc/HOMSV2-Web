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
}