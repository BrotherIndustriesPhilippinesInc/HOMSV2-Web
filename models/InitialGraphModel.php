<?php
require_once __DIR__ . '/BaseModel.php';

class InitialGraphModel extends BaseModel
{
    public function getInitialGraph(){
        $data = $this->PostgresqlSelect("test_table", "*", "", 50, 0, "time DESC");
        return $data;
    }
}
