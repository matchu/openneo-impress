<?php

class AddIndexOnSwfAssetIdToParentsSwfAssets extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute('CREATE INDEX parents_swf_assets_swf_asset_id '.
      'ON parents_swf_assets (swf_asset_id)');
	}//up()

	public function down() {
    $this->execute('DROP INDEX parents_swf_assets_swf_asset_id '.
      'ON parents_swf_assets');
	}//down()
}
?>
