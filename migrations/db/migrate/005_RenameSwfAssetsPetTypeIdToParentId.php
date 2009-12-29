<?php

class RenameSwfAssetsPetTypeIdToParentId extends Ruckusing_BaseMigration {

	public function up() {
    $this->rename_column('swf_assets', 'pet_type_id', 'parent_id');
	}//up()

	public function down() {
    $this->rename_column('swf_assets', 'parent_id', 'pet_type_id');
	}//down()
}
?>
