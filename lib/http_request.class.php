<?php
class HttpRequest {
  private $url;
  public function __construct($url) {
    $this->url = $url;
  }
  
  public function getResponse() {
    $ch = curl_init($this->url);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
  }
  
  static function get($url) {
    $request = new self($url);
    return $request->getResponse();
  }
  
  static function getJson($url) {
    return json_decode(self::get($url));
  }
}
?>
