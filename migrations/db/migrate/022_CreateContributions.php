<?php

class CreateContributions extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute('CREATE TABLE contributions ('.
      'id INT UNSIGNED NOT NULL AUTO_INCREMENT, '.
      'contributed_class ENUM("Pwnage_PetState", "Pwnage_PetType", "Pwnage_Object", "Pwnage_ObjectAsset") NOT NULL, '.
      'contributed_id INT UNSIGNED NOT NULL, '.
      'user_id INT UNSIGNED NOT NULL, '.
      'PRIMARY KEY (id)'.
    ')');
	}//up()

	public function down() {
    $this->drop_table('contributions');
	}//down()
}
?>
