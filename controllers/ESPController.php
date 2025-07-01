<?php 
require __DIR__ ."/../vendor/autoload.php";

require_once __DIR__ ."/Controller.php";
require_once __DIR__ ."/../models/ESPModel.php";

class ESPController extends Controller
{
    public function __construct() {
        parent::__construct(new ESPModel());
    }

    public function getESPSBySection($section, $isAlreadyRunning, $po_id = null) { 

        if($section == "BPS"){
            $section= "Tape Cassette";
        }
        $allESP = $this->getAll();

        $filteredESP = [];



        if($isAlreadyRunning === "true") {
            // Filter ESPs that are already running in the specified section
            $filteredESP = array_filter($allESP, function($esp) use ($section, $po_id) {
                return $esp["assigned_section"] == $section && isset($esp["isrunning"]) && $esp["isrunning"] === true && $esp["po_id"] == $po_id;
            });
        } else {

            $filteredESP = array_filter($allESP, function($esp) use ($section) {

                return $esp["assigned_section"] == $section && isset($esp["isrunning"]) && $esp["isrunning"] === false;
            });
        }

        return array_values($filteredESP);
    }
}