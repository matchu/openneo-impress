<?php

class AddSoldInMallToObjects extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute('ALTER TABLE objects '.
      'ADD COLUMN sold_in_mall TINYINT NOT NULL'
    );
	}//up()

	public function down() {
    $this->remove_column('objects', 'sold_in_mall');
	}//down()
}
?>
