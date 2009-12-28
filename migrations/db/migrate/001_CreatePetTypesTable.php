<?php

class CreatePetTypesTable extends Ruckusing_BaseMigration {

	public function up() {
    $pet_types = $this->execute(
      'CREATE TABLE pet_types('
      .'color_id TINYINT UNSIGNED NOT NULL,'
      .'species_id TINYINT UNSIGNED NOT NULL,'
      .'asset_ids TINYTEXT NOT NULL,'
      .'PRIMARY KEY (color_id, species_id)'
      .')'
    );
	}//up()

	public function down() {
    $this->drop_table('pet_types');
	}//down()
}
?>
