<?php 
require __DIR__ ."/../vendor/autoload.php";
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
require_once __DIR__ ."/Controller.php";
require_once __DIR__ ."/../models/STModel.php";

class STController extends Controller
{
    public function __construct() {
        parent::__construct(new STModel());
    }

    public function uploadST(array $data) {
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
                    $result = $this->model->upsertMultiple(["item_code"], $value);
                    
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
            $sheet = $spreadsheet->getSheetByName("ST");
    
            if (!$sheet) {
                throw new Exception("Sheet 'ST' not found.");
            }
    
            $highestRow = $sheet->getHighestRow(); // Last row with content
            
            $stData = [];

            for ($row = 2; $row <= $highestRow; $row++) {

                $stData[] = [
                    "plant"   => trim($sheet->getCell("A$row")->getCalculatedValue()),
                    "item_code"     => trim($sheet->getCell("B$row")->getCalculatedValue()),
                    "sequence_no"     => trim($sheet->getCell("C$row")->getCalculatedValue()),
                    "item_text"   => trim($sheet->getCell("D$row")->getCalculatedValue()),
                    "new_st_sap"  => trim($sheet->getCell("E$row")->getCalculatedValue()),
                    "current_st_mh"   => trim($sheet->getCell("F$row")->getCalculatedValue()),
                    "st_default_flag"      => trim($sheet->getCell("G$row")->getCalculatedValue()),
                    "st_update_sign"   => trim($sheet->getCell("H$row")->getCalculatedValue()),
                    "new_tt_sap"   => trim($sheet->getCell("I$row")->getCalculatedValue()),
                    "current_tt_mh"   => trim($sheet->getCell("J$row")->getCalculatedValue()),
                    "tt_update_sign"   => trim($sheet->getCell("K$row")->getCalculatedValue()),
                    "delete_sign"   => trim($sheet->getCell("L$row")->getCalculatedValue()),
                    "section"   => trim($sheet->getCell("N$row")->getCalculatedValue()),

                    "creator"       => $user,
                    "time_created"  => $time_created,
                    "updated_by"    => null,
                    "time_updated"  => null,
                ];
            }
            return $stData;
    
        } catch (Exception $e) {
            echo "Error reading Excel file: " . $e->getMessage();
            return [];
        }
    }
}