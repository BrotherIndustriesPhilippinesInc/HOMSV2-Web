<?php 
require __DIR__ ."/../vendor/autoload.php";

require_once __DIR__ ."/Controller.php";
require_once __DIR__ ."/../models/ProductionModel.php";
require_once __DIR__ ."/POLController.php";
require_once __DIR__ ."/../models/POLModel.php";
require_once __DIR__ ."/../helpers/DataRenamer.php";

class ProductionController extends Controller
{
    private $POLController;

    public function __construct() {
        parent::__construct(new ProductionModel());
        $this->POLController = new POLController();
    }
    public function checkLastAction(){

    }

    public function lastRun($data){
        $section = $data["section"];
        $work_center = $data["work_center"];
        $po = $data["po"];

        $pol = $this->POLController->getPODetails($section, $po);
        $production_record = $this->get("section = '{$section}' AND work_center = '{$work_center}' AND po_id = '{$pol['po_id']}'");

        if($production_record){
            $data = [
                "po_id"=> $pol["po_id"],
                "work_center"=> $pol["work_center"],
                "line_name"=> $pol["line_name"],
                "pc_status"=> $pol["pc_status"],
                "prod_status"=> $pol["prod_status"],
                "prd_order_no"=> $pol["prd_order_no"],
                "sales_order"=> $pol["sales_order"],
                "material"=> $pol["material"],
                "description"=> $pol["description"],
                "plan_quantity"=> $pol["plan_quantity"],
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
                "advance_reason"=> $production_record["advance_reason"],
                "advance_action"=> $production_record["advance_action"],
                "linestop_reason"=> $production_record["linestop_reason"],
                "linestop_action"=> $production_record["linestop_action"],
                "production_record_creator"=> $production_record["creator"],
                "production_record_time_created"=> $production_record["time_created"],
                "production_action"=> $production_record["production_action"]
            ];
            return $data;
        }else{
            return $pol;
        }
        
    }


    public function evaluatedUpdate($data){
        $end_time = date("Y-m-d", strtotime($data["end_time"])) ;
        $latestData = $this->get("time_created::date = '{$end_time}' AND section = '{$data['section']}' AND work_center = '{$data['work_center']}' AND po_id = '{$data['po_id']}'");

        return $this->model->insert($data);
    }

    public function getHistory($data){
        return $this->model->getHistory($data);
    }

    public function getSectionProduction($data){
        return $this->model->getSectionHistory($data);
    }
}