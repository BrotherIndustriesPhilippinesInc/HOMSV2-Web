<?php 
require __DIR__ ."/../vendor/autoload.php";
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
require_once __DIR__ ."/Controller.php";
require_once __DIR__ ."/../models/POLModel.php";
require_once __DIR__ ."/../helpers/DataRenamer.php";


class POLController extends Controller
{
    private DataRenamer $renamer;
    public function __construct() {
        parent::__construct(new POLModel());
        $this->renamer = new DataRenamer();
    }

    public function create(array $data){
        $user = $data["user_EmpNo"];
        $section = $data["section"];
        
        try {
            
            $polData = $this->readPOL($data, $user);
            
            if (empty($polData)) throw new Exception("No data provided.");
            
            switch ($section) {
                case "BPS":
                    $this->model->setTableName("tc");

                    break;
                case 'TC':
                    $this->model->setTableName("tc");

                    break;
                case 'PT':
                    $this->model->setTableName("pt");

                    break;
                
                default:
                    # code...
                    break;
            }

            $this->model->deleteAll();
            foreach ($polData as $key => $value) {
                $this->model->insert($value);
            }

            $this->moveFiletoServer($data);

        } catch (Exception $e) {
            return $this->errorResponse($e);
        }

        $uniqueWorkCenters = $this->findWorkCenter($polData);
        return ["work_centers"=>$uniqueWorkCenters];
    }
    
    private function moveFiletoServer(array $data) {
        date_default_timezone_set('Asia/Manila');

        try {
            if (empty($data)) throw new Exception("No data provided.");

            /* Move file to the resource folder */
            $basePath = __DIR__ . "/../resources/pols/";

            $filename = $data["name"];
            $filepath = $basePath . $filename;

            move_uploaded_file($data["tmp_name"], $filepath);

            /* Record to database */
            $to = [
                "name"=>"file_name",
                "tmp_name"=>"path",
            ];

            $result = $this->renamer->rename($data, $to);
            $result["path"] = $filepath;
            $result["upload_date"] = (new DateTime())->format('Y-m-d H:i:s');
            $result["uploaded_by"] = 0;

            unset($result["full_path"]);
            unset($result["type"]);
            unset($result["error"]);
            
            return $this->model->insert($result);

        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }

    private function readPOL($file, $user) {
        date_default_timezone_set('Asia/Manila');

        $tmpPath = $file["tmp_name"]; // Uploaded temp file
        
        try {
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($tmpPath);
            $sheet = $spreadsheet->getSheetByName("POL");
    
            if (!$sheet) {
                throw new Exception("Sheet 'POL' not found.");
            }
    
            $highestRow = $sheet->getHighestRow(); // Last row with content
            
            $polData = [];

            for ($row = 8; $row <= $highestRow; $row++) {
                $prd_order_no = trim($sheet->getCell("E$row")->getCalculatedValue());

                // Skip rows where prd_order_no is empty
                if ($prd_order_no === '' || $prd_order_no === null) {
                    continue;
                }


                $polData[] = [
                    "work_center"   => trim($sheet->getCell("A$row")->getCalculatedValue()),
                    "line_name"     => trim($sheet->getCell("B$row")->getCalculatedValue()),
                    "pc_status"     => trim($sheet->getCell("C$row")->getCalculatedValue()),
                    "prod_status"   => trim($sheet->getCell("D$row")->getCalculatedValue()),
                    "prd_order_no"  => $prd_order_no,
                    "sales_order"   => trim($sheet->getCell("F$row")->getCalculatedValue()),
                    "material"      => trim($sheet->getCell("G$row")->getCalculatedValue()),
                    "description"   => trim($sheet->getCell("H$row")->getCalculatedValue()),
                    "qty"      => trim($sheet->getCell("I$row")->getCalculatedValue()),
                    "creator"       => $user,
                    "time_created"  => (new DateTime())->format('Y-m-d H:i:s'),
                    "updated_by"    => null,
                    "time_updated"  => null,
                ];
            }
            return $polData;
    
        } catch (Exception $e) {
            echo "Error reading Excel file: " . $e->getMessage();
            return [];
        }
    }

    private function findWorkCenter($pol) {
        $uniqueValues = [];
        foreach ($pol as $row) {
            $value = $row["work_center"];
            // Skip empty cells and duplicates
            if ($value !== '' && !in_array($value, $uniqueValues)) {
                $uniqueValues[] = $value;
            }
        }
        return $uniqueValues;
    }

    public function getWorkCenters(){
        try {
            $this->model->setTableName("tc");
            $response = $this->model->getAll();
            $uniqueWorkCenters = $this->findWorkCenter($response);
            return $uniqueWorkCenters;
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }
}