<?php 
require __DIR__ ."/../vendor/autoload.php";

require_once __DIR__ ."/Controller.php";
require_once __DIR__ ."/../models/BreaktimeModel.php";
require_once __DIR__ ."/../models/ProductionModel.php";
require_once __DIR__ ."/../models/WorkcenterModel.php";

class BreaktimeController extends Controller
{
    private $productionModel;
    private $workcenterModel;
    public function __construct() {
        parent::__construct(new BreaktimeModel());
        // Initialize the models

        $this->productionModel = new ProductionModel();
        $this->workcenterModel = new WorkcenterModel();
    }



    public function computeRestTime($section, $workcenter, $dayNight, $start_time = null, $end_time = null) {
        $dayNight = strtolower($dayNight);
        $breaktime_id = null;
        if($dayNight === "day") {
            $breaktime_id = $this->workcenterModel->getAllWhere("workcenter = '$workcenter' AND (line_name LIKE '%(B)' OR line_name LIKE '% (B)')")[0]["breaktime_id"];
        } else {
            $breaktime_id = $this->workcenterModel->getAllWhere("workcenter = '$workcenter' AND (line_name LIKE '%(Y)' OR line_name LIKE '% (Y)')")[0]["breaktime_id"];
        }
        /* var_dump("Breaktime ID: $breaktime_id"); */
        
        $line_name = $this->get("id = {$breaktime_id}")["line"];
        
        $section_rest_times = $this->getAllWhere("line = '{$line_name}'");
        /* var_dump($section_rest_times); */

        $start_seconds = null;
        $end_seconds = null;
        $is_overnight = false;

        if ($start_time && $end_time) {
            $start_dt = DateTime::createFromFormat('H:i', $start_time);
            $end_dt = DateTime::createFromFormat('H:i', $end_time);

            if (!$start_dt || !$end_dt) {
                throw new Exception("Invalid time format. Use HH:mm.");
            }

            $start_seconds = ($start_dt->format('H') * 3600) + ($start_dt->format('i') * 60);
            $end_seconds = ($end_dt->format('H') * 3600) + ($end_dt->format('i') * 60);

            if ($start_seconds >= $end_seconds) {
                $is_overnight = true;
                $end_seconds += 86400; // next day
            }
        }

        $total_rest_time = 0;
        $used_breaks = [];

        $shift_duration_minutes = null;
        if ($start_seconds !== null && $end_seconds !== null) {
            $shift_duration_minutes = ($end_seconds - $start_seconds) / 60;
        }

        foreach ($section_rest_times as $rest_time) {
            $break_id = $rest_time['id'];
            $break_type = $rest_time['break_type'];
            $break_start_time = DateTime::createFromFormat('Y-m-d H:i:s', $rest_time['start_time']);
            $break_end_time = DateTime::createFromFormat('Y-m-d H:i:s', $rest_time['end_time']);

            $break_start_seconds = $this->toSecondsFromMidnight($break_start_time);
            $break_end_seconds = $this->toSecondsFromMidnight($break_end_time);

            $is_ot_break = $rest_time['isovertime']; // assuming this is a boolean or 0/1

            // Skip OT break if duration is not over 3 hours
            if ($is_ot_break && $shift_duration_minutes !== null && $shift_duration_minutes <= 180) {
                continue;
            }

            // Adjust breaks if they're also overnight relative to shift
            if ($is_overnight && $break_end_seconds < $start_seconds) {
                $break_start_seconds += 86400;
                $break_end_seconds += 86400;
            }

            if ($start_seconds !== null && $end_seconds !== null) {
                $overlap_start = max($start_seconds, $break_start_seconds);
                $overlap_end = min($end_seconds, $break_end_seconds);
                $overlap_duration = $overlap_end - $overlap_start;

                $min_overlap_seconds = 10 * 60;

                if ($overlap_duration >= $min_overlap_seconds && !isset($used_breaks[$break_type])) {
                    $break_duration = ($break_end_seconds - $break_start_seconds) / 60;

                    $total_rest_time += $break_duration;

                    $used_breaks[$break_type] = [
                        'id' => $break_id,
                        'duration' => round($break_duration, 2),
                        'start_time' => $break_start_time->format('H:i'),
                        'end_time' => $break_end_time->format('H:i')
                    ];
                }
            }
        }

        $used_breaks = array_reverse($used_breaks);
        return [
            'section' => $section,
            'start_time' => $start_time,
            'end_time' => $end_time,
            'total_rest_time' => $total_rest_time,
            'used_breaks' => $used_breaks
        ];
    }
    
    private function toSecondsFromMidnight($dateTime) {
        if (!$dateTime) {
            return 0;
        }
        return ($dateTime->format('H') * 3600) + ($dateTime->format('i') * 60);
    }
}