<?php

class AddDefaultToObjectsLastSpidered extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute(
      'ALTER TABLE objects ' .
      'MODIFY COLUMN last_spidered DATETIME'
    );
	}//up()

	public function down() {
    $this->execute(
      'ALTER TABLE objects ' .
      'MODIFY COLUMN last_spidered DATETIME NOT NULL'
    );
	}//down()
}
?>
