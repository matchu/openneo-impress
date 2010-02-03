<?php

class AddLastSpideredToObjects extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute('ALTER TABLE objects '.
      'ADD COLUMN last_spidered TIMESTAMP, '.
      'ADD INDEX objects_last_spidered (last_spidered)'
    );
	}//up()

	public function down() {
    $this->remove_column('objects', 'last_spidered');
	}//down()
}
?>
