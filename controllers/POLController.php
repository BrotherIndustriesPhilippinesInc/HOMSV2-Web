<?php 
require __DIR__ ."/../vendor/autoload.php";
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
require_once __DIR__ ."/Controller.php";
require_once __DIR__ ."/../models/POLModel.php";
require_once __DIR__ ."/../helpers/DataRenamer.php";
require_once __DIR__ ."/../controllers/UserController.php";

class POLController extends Controller
{
    private DataRenamer $renamer;
    public function __construct() {
        parent::__construct(new POLModel());
        $this->renamer = new DataRenamer();
    }

    private function setTableName($section) {
        switch ($section) {
            case "BPS":
                $this->model->setTableName("pr_one");
                break;
            case 'Tape Cassette':
                $this->model->setTableName("tc");
                break;
            case 'P-Touch':
                $this->model->setTableName("pt");
                break;
            case 'Printer 1':
                $this->model->setTableName("pr_one");
                break;
            default:
                throw new Exception("Invalid section name.");
        }
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
        $time_created = (new DateTime())->format('Y-m-d H:i:s');
        
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
                    "qty" => ($val = trim($sheet->getCell("I$row")->getCalculatedValue())) === '' ? 0 : $val,
                    "creator"       => $user,
                    "time_created"  => $time_created,
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

    public function create(array $data){
        $user = $data["user_EmpNo"];
        $section = $data["section"];
        $for_update = filter_var($data["for_update"], FILTER_VALIDATE_BOOLEAN);
        $is_multiple_files = filter_var($data["is_multiple_files"], FILTER_VALIDATE_BOOLEAN);
        $is_first_file = filter_var($data["is_first_file"], FILTER_VALIDATE_BOOLEAN);

        try {
            
            $polData = $this->readPOL($data, $user);
            
            if (empty($polData)) throw new Exception("No data provided.");
            
            $this->setTableName($section);

            if (!$for_update && $is_first_file) {
                $this->model->deleteAll();
            }
            
            if($for_update){
                
                foreach ($polData as $key => $value) {

                    $this->model->upsert("prd_order_no", $value);
                }

            }else{

                foreach ($polData as $key => $value) {

                    $this->model->insert($value);
                }

            }

            $this->moveFiletoServer($data);

        } catch (Exception $e) {
            return $this->errorResponse($e);
        }

        $uniqueWorkCenters = $this->findWorkCenter($polData);
        return ["work_centers"=>$uniqueWorkCenters];
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

    public function getWorkCenters(string $section){
        try {
            if($section == "bps"){
                $section = "tc";
            }
            $this->model->setTableName($section);
            $response = $this->model->getAll();
            $uniqueWorkCenters["work_centers"] = $this->findWorkCenter($response);
            return $uniqueWorkCenters;
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }

    public function getPOLUpdate($section)
    {
        try {
            if (strtolower($section) === "bps") {
                $section = "tc";
            }

            $this->model->setTableName($section);
            $response = $this->model->getAll();

            if (empty($response)) {
                throw new Exception("No records found.");
            }

            // Find the row with the latest timestamp (either time_updated or time_created)
            $latest = null;
            foreach ($response as $row) {
                $time = $row["time_updated"] ?? $row["time_created"];
                if (!$latest || strtotime($time) > strtotime($latest["timestamp"])) {
                    $latest = [
                        "timestamp" => $time,
                        "emp_no" => $row["updated_by"] ?? $row["creator"]
                    ];
                }
            }

            if (!$latest) {
                throw new Exception("Unable to determine last update.");
            }

            // Fetch user details
            $userController = new UserController();
            $userInfo = $userController->get($latest["emp_no"]);

            return [
                "last_update" => $latest["timestamp"],
                "last_update_by" => [
                    "EmpNo" => $userInfo["EmpNo"] ?? $latest["emp_no"],
                    "FullName" => $userInfo["Full_Name"] ?? "Unknown"
                ]
            ];
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }

    public function deletePOL($section){
        try {
            $this->setTableName($section);
            return $this->model->deleteAll();
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }

    }

    public function getPOList($section){
        try {
            $this->setTableName($section);
            return $this->model->getAll();
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }

    public function getPODetails($section, $po){
        try {
            $this->setTableName($section);
            
            $pol = $this->model->get("id = '$po'");
            $data=[
                "po_id"=> $pol["id"],
                "work_center"=> $pol["work_center"],
                "pol_line_name"=> $pol["line_name"],
                "pc_status"=> $pol["pc_status"],
                "prod_status"=> $pol["prod_status"],
                "prd_order_no"=> $pol["prd_order_no"],
                "sales_order"=> $pol["sales_order"],
                "material"=> $pol["material"],
                "description"=> $pol["description"],
                "plan_quantity"=> $pol["qty"],
                "pol_creator"=> $pol["creator"],
                "pol_time_created"=> $pol["time_created"],
                "pol_updated_by"=> $pol["updated_by"],
                "pol_time_updated"=> $pol["time_updated"]
            ];

            return $data;
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }

    public function checkPO($section, $po){
        try {
            $this->setTableName($section);
            return (bool)$this->model->checkIfExists("prd_order_no", $po);
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }

    public function getWC(string $section){
        try {
            if($section == "bps"){
                $section = "Tape Cassette";
            }
            $this->model->setTableNameNoAppend("workcenters");
            $response = $this->model->getAll();
            $uniqueWorkCenters["workcenters"] = $this->findWC($response, $section);
            return $uniqueWorkCenters;
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }

    private function findWC($data, $passedSection) {
        $uniqueValues = [];
        foreach ($data as $row) {
            $value = $row["workcenter"];
            $section = $row["section"];
            // Skip empty cells and duplicates
            if(strtolower($section) === strtolower($passedSection) ){
                if ($value !== '' && !in_array($value, $uniqueValues)) {
                    $uniqueValues[] = $value;
                }
            }
            
        }
        return $uniqueValues;
    }
}