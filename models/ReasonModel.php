<?php 
require_once __DIR__ . "/Model.php";

class ReasonModel extends Model
{
    public function __construct() {
        parent::__construct();
    }

    protected function getTableName(): string {
        return "reasons";
    }
}