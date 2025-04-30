<?php 
require __DIR__ ."/../vendor/autoload.php";

require_once __DIR__ ."/Controller.php";
require_once __DIR__ ."/../models/ProductionModel.php";

class ProductionController extends Controller
{
    public function __construct() {
        parent::__construct(new ProductionModel());
    }
}