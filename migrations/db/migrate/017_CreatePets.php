<?php

class CreatePets extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute('CREATE TABLE pets ('.
      'id INT UNSIGNED NOT NULL AUTO_INCREMENT, '.
      'name VARCHAR(20) NOT NULL, '.
      'pet_type_id MEDIUMINT UNSIGNED NOT NULL, '.
      'PRIMARY KEY (id), '.
      'INDEX pets_name (name), '.
      'INDEX pets_pet_type_id (pet_type_id)'.
    ')');
	}//up()

	public function down() {
    $this->drop_table('pets');
	}//down()
}
?>
