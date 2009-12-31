<?php

class AddImageHashToPetTypes extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute('ALTER TABLE pet_types '
      .'ADD image_hash CHAR(8)'
    );
	}//up()

	public function down() {
    $this->remove_column('pet_types', 'image_hash');
	}//down()
}
?>
