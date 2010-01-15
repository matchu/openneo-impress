<?php
require_once 'SabreAMF/Client.php';

class Wearables_Amf {
  const GATEWAY_URL = 'http://www.neopets.com/amfphp/gateway.php';
  const SERVICE_NAME = 'CustomPetService';
  
  function sendRequest($method, $arguments=null) {
    try {
      $client = new SabreAMF_Client(self::GATEWAY_URL); // oddly, must be regenerated to do multiple requests
      $response = $client->sendRequest(self::SERVICE_NAME.'.'.$method, $arguments);
    } catch(Exception $e) {
      throw new Wearables_AmfConnectionError();
    }
    if(!self::isTypedObject($response)) {
      throw new Wearables_AmfResponseError($response);
    }
    return $response;
  }
  
  static function getApplicationData() {
    static $application_data;
    if(!$application_data) {
      $amf = new Wearables_Amf();
      $application_data = $amf->sendRequest('getApplicationData')->getAMFData();
    }
    return $application_data;
  }
  
  static function isTypedObject($obj) {
    return get_class($obj) == 'SabreAMF_TypedObject';
  }
  
  static function stripAMFCalls($obj) {
    if(is_array($obj)) {
      foreach($obj as $key => $value) {
        $obj[$key] = self::stripAMFCalls($value);
      }
      return $obj;
    } elseif(get_class($obj) == 'stdClass') {
      foreach($obj as $key => $value) {
        $obj->$key = self::stripAMFCalls($value);
      }
      return $obj;
    } elseif(self::isTypedObject($obj)) {
      return self::stripAMFCalls($obj->getAMFData());
    } else {
      return $obj;
    }
  }
}

class Wearables_AmfConnectionError extends Exception {}

class Wearables_AmfResponseError extends Exception {
  private $response;
  
  public function __construct($response) {
    $this->response = $response;
    parent::__construct("Error from AMF gateway: ".$response['description']);
  }
  
  public function getResponse() {
    return $this->response;
  }
}
?>
