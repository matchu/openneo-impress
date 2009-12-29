<?php

class RenameObjectIdToParentIdInSwfAsset extends Ruckusing_BaseMigration {

	public function up() {
    $this->rename_column('swf_assets', 'object_id', 'parent_id');
	}//up()

	public function down() {
    $this->rename_column('swf_assets', 'parent_id', 'object_id');
	}//down()
}
?>
