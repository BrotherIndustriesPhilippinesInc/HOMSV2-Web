<?php 
require_once __DIR__ ."/../helpers/MSQLServer.php";

class UserModel
{
    private MSQLServer $db;

    public function __construct() {
        $this->db = new MSQLServer();
    }

    public function get(string $where){
    $data = $this->db->query("SELECT TOP(1) * FROM tbl_EMSVIEW WHERE EmpNo = '$where'");
    
    if ($data) {
        $record = $data[0];

        // Translate section codes
        switch ($record["Section"]) {
            case "TC":
                $record["Section"] = "Tape Cassette";
                break;
            case "IC":
                $record["Section"] = "Ink Cartridge";
                break;
            // Add more mappings here, baka gusto mo pang dagdagan
            case "BPS":
                $record["Section"] = "Tape Cassette";
                break;
            case "IH":
                $record["Section"] = "Ink Head";
                break;
            case "PT":
                $record["Section"] = "P-Touch";
                break;
            case "MOLD":
                $record["Section"] = "Molding";
                break;
            case "PCBA":
                $record["Section"] = "PCBA";
                break;
            case "PR1":
                $record["Section"] = "Printer 1";
                break;
            case "PR2":
                $record["Section"] = "Printer 2";
                break;
            case "TN":
                $record["Section"] = "Toner";
                break;
            default:
                // leave as-is
                break;
        }
        return $record;
    } else {
        throw new Exception("No data found for the given condition.", 404);
    }
}

}
