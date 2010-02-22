<?php

class AddCreatedAtToContributions extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute('ALTER TABLE contributions '.
      'ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL'
    );
	}//up()

	public function down() {
    $this->remove_column('contributions', 'created_at');
	}//down()
}
?>
