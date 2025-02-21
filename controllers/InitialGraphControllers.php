<?php 
require_once __DIR__ . '/../models/InitialGraphModel.php';

class InitialGraphControllers
{
    private $model;
    public function __construct() {
        $this->model = new InitialGraphModel();
    }

    public function getInitialGraph(){
        $data = $this->model->getInitialGraph();
        return $data;
    }
}