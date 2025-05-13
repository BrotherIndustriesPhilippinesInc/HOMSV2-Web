<?php 
require __DIR__ ."/../vendor/autoload.php";
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

require_once __DIR__ ."/Controller.php";
require_once __DIR__ ."/../models/HistoryModel.php";

class HistoryController extends Controller
{
    public function __construct() {
        parent::__construct(new HistoryModel());
    }
}
