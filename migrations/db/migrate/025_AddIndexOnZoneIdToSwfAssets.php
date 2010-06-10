<?php

class AddIndexOnZoneIdToSwfAssets extends Ruckusing_BaseMigration {

	public function up() {
    $this->add_index('swf_assets', 'zone_id');
	}//up()

	public function down() {
    $this->remove_index('swf_assets', 'zone_id');
	}//down()
}
?>
