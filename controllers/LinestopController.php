<?php 
require __DIR__ ."/../vendor/autoload.php";

require_once __DIR__ ."/Controller.php";
require_once __DIR__ ."/../models/LinestopModel.php";

class LinestopController extends Controller
{
    public function __construct() {
        parent::__construct(new LinestopModel());
    }

    public function getLineStopsView($section) {
        $result = $this->model->getLineStopsView($section);
        return $result;
    }

    public function getRecentLinestops($section){
        $result = $this->model->getRecentLineStopsView($section);
        return $result;
    }
}