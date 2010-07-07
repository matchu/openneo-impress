<?php

class CreatePetLoads extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute('CREATE TABLE pet_loads ('.
      'id INT UNSIGNED NOT NULL AUTO_INCREMENT, '.
      'pet_name VARCHAR(20) NOT NULL, '.
      'amf TEXT NOT NULL, '.
      'created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, '.
      'PRIMARY KEY (id)'.
    ')');
	}//up()

	public function down() {
    $this->drop_table('pet_loads');
	}//down()
}
?>
