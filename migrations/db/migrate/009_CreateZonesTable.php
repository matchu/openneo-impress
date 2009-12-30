<?php

require_once dirname(__FILE__).'/../../../lib/amf.class.php';
require_once dirname(__FILE__).'/../../../lib/db.class.php';

class CreateZonesTable extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute('CREATE TABLE zones ('
      .'id TINYINT UNSIGNED NOT NULL, '
      .'depth TINYINT UNSIGNED NOT NULL, '
      .'type_id TINYINT UNSIGNED NOT NULL, '
      .'type VARCHAR(40) NOT NULL, '
      .'label VARCHAR(40) NOT NULL, '
      .'PRIMARY KEY (id)'
    .')');
    $db = new Wearables_DB();
    $zones = Wearables_AMF::getApplicationData()->zones;
    $zone_columns = array('id', 'depth', 'type_id', 'type', 'label');
    $keyset = implode(', ', $zone_columns);
    $valuesets = array();
    foreach($zones as $zone_data) {
      $zone = $zone_data->getAMFData();
      $valueset = array();
      foreach($zone_columns as $zone_column) {
        $valueset[] = $db->quote($zone->$zone_column);
      }
      $valuesets[] = '('.implode(', ', $valueset).')';
    }
    $all_valuesets = implode(', ', $valuesets);
    $this->execute("INSERT INTO zones ($keyset) VALUES $all_valuesets");
	}//up()

	public function down() {
    $this->drop_table('zones');
	}//down()
}
?>
