<?php
class PwnageCore_ValidationError {
  private $attribute;
  private $message;
  
  public function __construct($attribute, $message) {
    $this->attribute = $attribute;
    $this->message = $message;
  }
  
  public function getMessage() {
    return PwnageCore_StringHelper::humanize($this->attribute).' '.
      $this->message;
  }
}
?>
