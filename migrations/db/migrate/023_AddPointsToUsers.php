<?php

class AddPointsToUsers extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute('ALTER TABLE users '.
      'ADD COLUMN points INT UNSIGNED NOT NULL'
    );
	}//up()

	public function down() {
    $this->remove_column('users', 'points');
	}//down()
}
?>
