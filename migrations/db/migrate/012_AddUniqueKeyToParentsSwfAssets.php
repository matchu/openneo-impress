<?php

class AddUniqueKeyToParentsSwfAssets extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute('ALTER TABLE parents_swf_assets '.
      'ADD UNIQUE KEY unique_parents_swf_assets (parent_id, swf_asset_id, swf_asset_type)'
    );
	}//up()

	public function down() {
    $this->execute('ALTER TABLE parents_swf_assets '.
      'DROP KEY unique_parents_swf_assets'
    );
	}//down()
}
?>
