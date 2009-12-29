<?php

class CreateObjectsTable extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute(
      'CREATE TABLE objects ('
      .'id MEDIUMINT UNSIGNED NOT NULL, '
      .'zones_restrict TINYTEXT NOT NULL, '
      .'thumbnail_url TEXT NOT NULL, '
      .'name VARCHAR(100) NOT NULL, '
      .'description TEXT NOT NULL, '
      .'category VARCHAR(50) NOT NULL, '
      .'type VARCHAR(50) NOT NULL, '
      .'rarity VARCHAR(25) NOT NULL, '
      .'rarity_index TINYINT UNSIGNED NOT NULL, '
      .'price MEDIUMINT UNSIGNED NOT NULL, '
      .'weight_lbs SMALLINT UNSIGNED NOT NULL, '
      .'species_support_ids TEXT, '
      .'PRIMARY KEY (id), '
      .'INDEX (name)'
      .')'
    );
	}//up()

	public function down() {
    $this->drop_table('objects');
	}//down()
}
?>
