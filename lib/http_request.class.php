<?php
class HttpRequest {
  private $url;
  public function __construct($url) {
    $this->url = $url;
  }
  
  public function getResponse() {
    $ch = curl_init($this->url);
    curl_setopt($ch, CURLOPT_HEADERS, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
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
