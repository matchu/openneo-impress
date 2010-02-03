<?php

class AddUniqueIndexOnNameToPets extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute('DROP INDEX pets_name ON pets');
    $this->execute('CREATE UNIQUE INDEX pets_name ON pets (name)');
	}//up()

	public function down() {
    $this->execute('DROP INDEX pets_name ON pets');
    $this->execute('CREATE INDEX pets_name ON pets (name)');
	}//down()
}
?>
