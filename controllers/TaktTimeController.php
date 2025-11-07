<?php 
require_once __DIR__ ."/Controller.php";
require_once __DIR__ ."/../models/TaktTimeModel.php";

class TaktTimeController extends Controller
{
    public function __construct() {
        parent::__construct(new TaktTimeModel());
    }
}