<?php

class AddDefaultValueToUserPoints extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute('ALTER TABLE users MODIFY COLUMN points INTEGER UNSIGNED NOT NULL DEFAULT 0');
	}//up()

	public function down() {
    $this->execute('ALTER TABLE users MODIFY COLUMN points INTEGER UNSIGNED NOT NULL');
	}//down()
}
?>
