<?php
require_once '../lib/amf.class.php';
header('Content-type: application/json');
$data = Wearables_AMF::stripAMFCalls(Wearables_AMF::getApplicationData());
echo json_encode($data);
?>
