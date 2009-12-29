<?php

class AddBodyIds extends Ruckusing_BaseMigration {

	public function up() {
	  $this->execute(
	    'ALTER TABLE swf_assets '
	    .'DROP parent_id, '
	    .'ADD body_id SMALLINT UNSIGNED NOT NULL, '
	    .'ADD object_id MEDIUMINT UNSIGNED NOT NULL, '
	    .'ADD INDEX swf_assets_body_id_and_object_id (body_id, object_id)'
	  );
    $this->execute(
      'ALTER TABLE pet_types '
      .'ADD body_id SMALLINT UNSIGNED NOT NULL'
    );
	}//up()

	public function down() {
	  $this->execute(
	    'ALTER TABLE swf_assets '
	    .'DROP body_id, '
	    .'DROP object_id, '
	    .'DROP INDEX swf_assets_body_id_and_object_id, '
	    .'ADD parent_id MEDIUMINT UNSIGNED NOT NULL'
	  );
	  $this->remove_column('pet_types', 'body_id');
	}//down()
}
?>
