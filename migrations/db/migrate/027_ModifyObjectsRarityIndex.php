<?php

class ModifyObjectsRarityIndex extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute(
      'ALTER TABLE objects '.
      'MODIFY rarity_index SMALLINT UNSIGNED NOT NULL'
    );
    $this->execute('UPDATE objects SET rarity_index = 500 WHERE rarity_index = 255');
	}//up()

	public function down() {
    $this->execute(
      'ALTER TABLE objects '.
      'MODIFY rarity_index TINYINT UNSIGNED NOT NULL'
    );
	}//down()
}
?>
