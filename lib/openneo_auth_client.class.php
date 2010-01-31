<?php
class OpenneoAuthClient {
  protected $data;
  
  public function __construct($data) {
    $this->data = $data;
  }
  
  public function getSessionId() {
    return $this->data['session_id'];
  }
  
  public function getSource() {
    return $this->data['source'];
  }
  
  public function getUserData() {
    return $this->data['user'];
  }
  
  public function validateData($secret) {
    $data = $this->data;
    $given_signature = $data['signature'];
    unset($data['signature']);
    $correct_signature = OpenneoAuthSignatory::sign($data, $secret);
    if($given_signature != $correct_signature) {
      throw new OpenneoAuthClient_InvalidDataException('Incorrect signature');
    }
  }
}

class OpenneoAuthClient_InvalidDataException extends Exception {}
?>
