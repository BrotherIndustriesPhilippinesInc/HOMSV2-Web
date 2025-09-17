<?php 
require_once __DIR__ . "/Model.php";

class LinestopModel extends Model
{
    public function __construct() {
        parent::__construct();
    }

    protected function getTableName(): string {
        return "linestops";
    }

    public function getLineStopsView($section) {
        $result = $this->executePrepared("SELECT * FROM public.\"getLinestopsView\" WHERE section = '$section' ORDER BY id DESC;");
        
        return $result;
    }

    public function getRecentLineStopsView($section) {
        $result = $this->executePrepared("SELECT * FROM public.\"getLinestopsView\" WHERE section = 'Tape Cassette' ORDER BY id DESC LIMIT 1;");
        return $result;
    }
}