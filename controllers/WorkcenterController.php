<?php 
require __DIR__ ."/../vendor/autoload.php";
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

require_once __DIR__ ."/Controller.php";
require_once __DIR__ ."/../models/WorkcenterModel.php";
require_once __DIR__ ."/../models/BreaktimeModel.php";

class WorkcenterController extends Controller
{
    private $breaktimeModel;
    public function __construct() {
        parent::__construct(new WorkcenterModel());
        $this->breaktimeModel = new BreaktimeModel();
    }

    public function uploadWorkcenters(array $data) {
        $user = $data["creator"];
        $results = [
            'inserted' => 0,
            'updated' => 0,
            'skipped' => 0,
            'failed' => 0,
            'errors' => []
        ];
    
        try {
            $wcData = $this->readFile($data, $user);
            if (empty($wcData)) throw new Exception("No data provided.");
    
            foreach ($wcData as $key => $value) {
            
                try {
                    $result = $this->model->upsertMultiple(["workcenter", "line_name"], $value);
                    
                    if ($result === 'inserted') {
                        $results['inserted']++;
                    } elseif ($result === 'updated') {
                        $results['updated']++;
                    } else {
                        $results['skipped']++; // in case your logic skips without returning
                    }
    
                } catch (Exception $e) {
                    $results['failed']++;
                    $results['errors'][] = [
                        'row' => $key + 2,
                        'workcenter' => $value['workcenter'],
                        'line_name' => $value['line_name'],
                        'error' => $e->getMessage()
                    ];
                }
            }
    
            return $results;
    
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }
    


    private function readFile($file, $user) {
        date_default_timezone_set('Asia/Manila');
        $time_created = (new DateTime())->format('Y-m-d H:i:s');
        
        $tmpPath = $file["tmp_name"]; // Uploaded temp file
        
        try {
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($tmpPath);
            $sheet = $spreadsheet->getSheetByName("Workcenters");
    
            if (!$sheet) {
                throw new Exception("Sheet 'Workcenters' not found.");
            }
    
            $highestRow = $sheet->getHighestRow(); // Last row with content
            
            $wcData = [];

            for ($row = 2; $row <= $highestRow; $row++) {

                $wcData[] = [
                    "section"   => trim($sheet->getCell("A$row")->getCalculatedValue()),
                    "costcenter"     => trim($sheet->getCell("B$row")->getCalculatedValue()),
                    "costcenter_name"     => trim($sheet->getCell("C$row")->getCalculatedValue()),
                    "plant"   => trim($sheet->getCell("D$row")->getCalculatedValue()),
                    "workcenter"  => trim($sheet->getCell("E$row")->getCalculatedValue()),
                    "line_name"   => trim($sheet->getCell("F$row")->getCalculatedValue()),
                    "folder_name"      => trim($sheet->getCell("G$row")->getCalculatedValue()),
                    "pattern"   => trim($sheet->getCell("H$row")->getCalculatedValue()),
                    "dpr_template"   => trim($sheet->getCell("I$row")->getCalculatedValue()),
                    "creator"       => $user,
                    "time_created"  => $time_created,
                    "updated_by"    => null,
                    "time_updated"  => null,
                ];
            }
            return $wcData;
    
        } catch (Exception $e) {
            echo "Error reading Excel file: " . $e->getMessage();
            return [];
        }
    }

    public function updateWorkcenterBreaktime($section, $line_name, $workcenter) {
        $matchedBreaktime = $this->breaktimeModel->getAllWhere("section = '$section' AND line = '$line_name'");
        $wc = $this->model->getAllWhere("workcenter = '$workcenter'");

        /* var_dump($wc); */
        if (empty($matchedBreaktime)) {
            throw new Exception("No matching breaktime found for section '$section' and line '$line_name'.");
        }
        if (empty($wc)) {
            throw new Exception("No workcenter found for workcenter '$workcenter'.");
        }
        foreach ($wc as $key => $value) {
            $this->update($value["id"], ["breaktime_id" => $matchedBreaktime[0]["id"]]);
        }
    }

    public function getWorkcentersFromViews(){
        $result = $this->model->executePrepared("SELECT * FROM public.\"getWorkcentersView\";");
        return $result;
    }

    public function updateWorkcenter($id, array $data) {
        try {
            $this->update($id, $data);
            $this->updateWorkcenterBreaktime($data["section"], $data["breaktime_line_name"], $data["workcenter"]);
        } catch (Exception $th) {
            return $this->errorResponse($th);
        }
    }

}
