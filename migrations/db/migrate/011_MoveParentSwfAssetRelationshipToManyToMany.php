<?php

class MoveParentSwfAssetRelationshipToManyToMany extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute('CREATE TABLE parents_swf_assets ('.
      'parent_id MEDIUMINT UNSIGNED NOT NULL, '.
      'swf_asset_id MEDIUMINT UNSIGNED NOT NULL, '.
      'swf_asset_type ENUM("biology", "object"), '.
      'INDEX parent_swf_assets_parent_id (parent_id)'.
    ')');
    $this->remove_column('swf_assets', 'parent_id');
	}//up()

	public function down() {
	  $this->execute('ALTER TABLE swf_assets '.
      'ADD COLUMN parent_id MEDIUMINT UNSIGNED NOT NULL'
    );
    $this->drop_table('parents_swf_assets');
	}//down()
}
?>
