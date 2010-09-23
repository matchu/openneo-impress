<?php
class PwnageCore_Logger {
  const DATE_FORMAT = 'Y-m-d H:i:s';
  static $output;
  static $output_path;
  
  static function info($str) {
    if(isset(self::$output_path)) self::$output .= "$str\n";
  }

  static function query($query, $time, $params=array()) {
    $str = "SQL ({$time}ms) $query";
    if(!empty($params)) {
      $str .= ' -- ' . json_encode($params);
    }
    self::info($str);
  }
  
  static function request($path, $ip, $get, $post, $cookie) {
    $time = date(self::DATE_FORMAT);
    self::info("Request to $path (from $ip at $time)");
    if(!empty($get))     self::info("GET:    " . json_encode($get));
    if(!empty($post))    self::info("POST:   " . json_encode($post));
    if(!empty($cookie))  self::info("COOKIE: " . json_encode($cookie));
  }
  
  static function open($path) {
    self::$output_path = $path;
  }
  
  static function close() {
    self::$output .= "\n";
    file_put_contents(self::$output_path, self::$output, FILE_APPEND);
  }
}

if(realpath(__FILE__) == realpath($_SERVER['SCRIPT_FILENAME'])) {
  function exception_error_handler($errno, $errstr, $errfile, $errline ) {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
  }
  set_error_handler('exception_error_handler', E_ERROR);
  
  PwnageCore_Logger::info('Hello'); // do nothing
  PwnageCore_Logger::query('SELECT 1', 123); // do nothing
  
  PwnageCore_Logger::open('/tmp/pwnage_logger_test.log');
  PwnageCore_Logger::request(
    '/example', // path
    '123.456.789', // ip
    array('foo' => 'bar', 'bar' => 'baz'), // $_GET
    array(), // $_POST
    array('user' => 'awesome', 'super' => 'cool') // $_COOKIE
  );
  PwnageCore_Logger::info('Hello, world!'); // log "Request to /example"
  PwnageCore_Logger::query('SELECT 1', 123); // log "SQL (123ms): SELECT 1" 
  PwnageCore_Logger::close();
}
