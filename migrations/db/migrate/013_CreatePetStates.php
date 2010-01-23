<?php

class CreatePetStates extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute('CREATE TABLE pet_states ('.
      'id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT, '.
      'pet_type_id MEDIUMINT UNSIGNED NOT NULL, '.
      'swf_asset_ids TINYTEXT NOT NULL, '.
      'PRIMARY KEY (id), '.
      'INDEX pet_states_pet_type_id (pet_type_id)'.
    ')');
	}//up()

	public function down() {
    $this->drop_table('pet_states');
	}//down()
}
?>
