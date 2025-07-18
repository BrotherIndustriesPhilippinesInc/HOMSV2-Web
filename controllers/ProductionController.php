<?php 
require_once __DIR__ ."/Controller.php";
require_once __DIR__ ."/../models/ProductionModel.php";
require_once __DIR__ ."/POLController.php";
require_once __DIR__ ."/../models/POLModel.php";
require_once __DIR__ ."/../helpers/DataRenamer.php";
require_once __DIR__ ."/ESPController.php";
require_once __DIR__ ."/WorkCenterController.php";
require_once __DIR__ ."/UserController.php";
require_once __DIR__ ."/BreaktimeController.php";

class ProductionController extends Controller
{
    private $POLController;

    private $espController;

    private $workCenterController;

    private $userController;

    private $breaktimeController;

    public function __construct() {
        parent::__construct(new ProductionModel());
        $this->POLController = new POLController();
        $this->espController = new ESPController();
        $this->workCenterController = new WorkCenterController();
        $this->userController = new UserController();
        $this->breaktimeController = new BreaktimeController();

    }


    public function lastRun($data){
        $section = $data["section"];
        $work_center = $data["work_center"];
        $po = $data["po"];
        $date = $data["date"];

        $pol = $this->POLController->getPODetails($section, $po, $date);
        $production_record = $this->get("section = '{$section}' AND work_center = '{$work_center}' AND po_id = '{$pol['po_id']}' AND time_created::date = '{$date}'");

        $assignedESP = $this->espController->get("assigned_section = '{$section}' AND po_id = '{$pol['po_id']}' AND isrunning = true");
        
        if($production_record){

            $data = [
                "po_id"=> $pol["po_id"],    
                "work_center"=> $pol["work_center"],
                "line_name"=> $production_record["line_name"],
                /* "pol_area"=> $pol["line_name"], */
                "pc_status"=> $pol["pc_status"],
                "prod_status"=> $pol["prod_status"],
                "prd_order_no"=> $pol["prd_order_no"],
                "sales_order"=> $pol["sales_order"],
                "material"=> $pol["material"],
                "description"=> $pol["description"],

                "plan_quantity"=> $production_record["plan_quantity"],
                
                "pol_creator"=> $pol["pol_creator"],
                "pol_time_created"=> $pol["pol_time_created"],
                "pol_updated_by"=> $pol["pol_updated_by"],
                "pol_time_updated"=> $pol["pol_time_updated"],
                
                "prod_record_id"=> $production_record["id"],
                "section"=> $production_record["section"],
                "area"=> $production_record["area"],
                "takt_time"=> $production_record["takt_time"],
                "actual_quantity"=> $production_record["actual_quantity"],
                "variance"=> $production_record["variance"],
                "shift"=> $production_record["shift"],
                "hourly_time"=> $production_record["hourly_time"],
                "direct_operators"=>$production_record["direct_operators"],
                "start_time"=> $production_record["start_time"],
                "end_time"=> $production_record["end_time"],
                /* "advance_reason"=> $production_record["advance_reason"],
                "advance_action"=> $production_record["advance_action"],
                "linestop_reason"=> $production_record["linestop_reason"],
                "linestop_action"=> $production_record["linestop_action"], */
                "production_record_creator"=> $production_record["creator"],
                "production_record_time_created"=> $production_record["time_created"],
                "production_action"=> $production_record["production_action"],
                "advance_reasons"=> $production_record["advance_reasons"],
                "linestop_reasons"=> $production_record["linestop_reasons"],

                "target"=> $production_record["target"],

                "esp_id"=> $assignedESP ? $assignedESP["id"] : 0,
                "esp_name"=> $assignedESP ? $assignedESP["esp_name"] : "Manual",
                "esp_sensor_name"=> $assignedESP ? $assignedESP["sensor_name"] : "Input",

                "unique_session"=> $production_record["unique_session"],
            ];
            return $data;
        }else{
            return $pol;
        }
    }

    public function evaluatedUpdate($data) {
        // Get the current (latest) record
        $latestData = $this->get("time_created::date = '{$data['end_time']}' AND section = '{$data['section']}' AND work_center = '{$data['work_center']}' AND po_id = '{$data['po_id']}'", "ORDER BY id DESC LIMIT 1");
        
        // Get the record *before* the latest one
        $previousData = $this->get("time_created::date = '{$data['end_time']}' AND section = '{$data['section']}' AND work_center = '{$data['work_center']}' AND po_id = '{$data['po_id']}' AND id < {$latestData['id']}", "ORDER BY id DESC LIMIT 1");

        // Initialize cumulative values
        $prevPlan = $previousData && isset($previousData['commulative_plan']) ? $previousData['commulative_plan'] : 0;
        $prevActual = $previousData && isset($previousData['commulative_actual']) ? $previousData['commulative_actual'] : 0;


        // Calculate new cumulative values
        $newCummulativePlan = $prevPlan + $data['target'];
        $newCummulativeActual = $prevActual + $data['actual_quantity'];

        // Update current row
        return $this->model->update($latestData["id"], [

            "compliance_rate"      => $data["compliance_rate"],
            "actual_quantity"      => $data["actual_quantity"], 
            "target"               => $data["target"],
            "variance"             => $data["variance"],
            "direct_operators"     => $data["direct_operators"],
            "end_time"             => $data["end_time"], 
            "advance_reasons"      => $data["advance_reasons"],
            "linestop_reasons"     => $data["linestop_reasons"],
            "ended_by"             => $data["creator"],
            "production_action"    => "end",
            "commulative_plan"     => $newCummulativePlan,
            "commulative_actual"   => $newCummulativeActual,
        ]);
    }


    public function getHistory($data){
        return $this->model->getHistory($data);
    }

    public function getSectionProduction($data){
        return $this->model->getSectionHistory($data);
    }

    public function updateActualQuantityViaESP($data){
        /* $id = $data["id"]; */
        /* GET CURRENT DATA */
        $latestRun = $this->get("po = '{$data['po']}'");
        if($latestRun["production_action"] === "start"){
            /* Update Quantity */
            $data = [
                "actual_quantity"=> $latestRun["actual_quantity"] + 1,
                "variance"=> $latestRun["variance"] - 1,
                "time_created"=> date("Y-m-d H:i:s"),
                "creator"=> "ESP",
            ];
            return $this->model->updateActualQuantityViaESPModel($latestRun["id"], $data);
        }else{
            throw new Exception("No production record found for this PO.");
        }
    }

    public function generateHOFile($wc, $date, ){
        
        $data = $this->model->getAllWhere("(start_time::date = '{$date}' OR end_time::date = '{$date}') AND work_center = '{$wc}'");

        return $data;
    }

    public function generateDPRDetails($wc, $date, $section, $user_id){

        /* GET RELEVANT DATA */
        $production_data = $this->model->getAllWhere("(start_time::date = '{$date}' OR end_time::date = '{$date}') AND work_center = '{$wc}' AND section = '{$section}'");

        $workcenterData = $this->workCenterController->get("workcenter = '$wc' AND section = '$section'");

        $userData = $this->userController->get($user_id);

        /* BUILD DATA */
        $dpr_data = [
            "production_data" => $production_data,
            "workcenter_data" => $workcenterData,
            "user_data" => $userData
        ];

        return $dpr_data;
    }
}