<?php
require_once __DIR__ . '/../../views/components/buttons.php'; // or wherever your class is

$work_centers = json_decode(file_get_contents("php://input"), true)["work_centers"];
$button = new Buttons();

$html = '';
foreach ($work_centers as $wc) {
    $html .= $button->primaryButton("wc-button", $wc, "", "", "data-wc-value='{$wc}'");
}

header('Content-Type: application/json');
echo json_encode(['html' => $html]);
