<?php
/* Class definition for wearable objects, since that's what Neo calls them */

class Wearables_Object {
  public function __construct($data) {
    $this->name = $data->name;
    $this->thumbnail_url = $data->thumbnail_url;
  }
}
?>
