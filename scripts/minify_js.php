#!/usr/bin/php
<?php
require_once dirname(__FILE__).'/../pwnage/environment.php';

class Pwnage_ClosureRequest {
  private $input;
  
  public function __construct($file) {
    $this->input = file_get_contents($file);
  }
  
  public function exec($type='compiled_code') {
    $query = array(
      'compilation_level' => 'SIMPLE_OPTIMIZATIONS',
      'output_format' => 'json',
      'output_info' => $type,
      'js_code' => $this->input
    );
    $curl = curl_init('http://closure-compiler.appspot.com/compile');
    curl_setopt($curl, CURLOPT_HEADER, 0);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_POST, 1);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($query));
    $output = json_decode(curl_exec($curl));
    if($type == 'compiled_code') {
      if($output->compiledCode) {
        return $output->compiledCode;
      } else {
        echo "There were errors - fetching now...\n";
        $this->exec('errors');
      }
    } elseif($type == 'errors') {
      echo count($output->errors)." errors compiling $basename\n";
      foreach($output->errors as $error) {
        echo "$error->error at line $error->lineno, char $error->charno\n",
          $error->line, "\n";
      }
      die();
    }
  }
}

$files = glob(PWNAGE_ROOT.'/app/js/*.js');
foreach($files as $file) {
  $basename = basename($file);
  echo "Processing $basename...\n";
  $request = new Pwnage_ClosureRequest($file);
  $output = $request->exec();
  $output_file = PWNAGE_ROOT.'/www/assets/js/'.$basename;
  file_put_contents($output_file, $output);
  echo "$basename saved.\n";
}
?>
