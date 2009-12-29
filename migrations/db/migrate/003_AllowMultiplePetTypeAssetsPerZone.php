<?php

class AllowMultiplePetTypeAssetsPerZone extends Ruckusing_BaseMigration {

	public function up() {
    $this->remove_column('pet_types', 'asset_ids');
    $this->execute('ALTER TABLE pet_types '
      .'DROP PRIMARY KEY, '
      .'ADD id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT, '
      .'ADD PRIMARY KEY (id), '
      .'ADD UNIQUE KEY pet_types_species_color (species_id, color_id)');
      
    // pet_type_id only to be used for biology
    $this->execute('ALTER TABLE swf_assets '
      .'ADD pet_type_id MEDIUMINT UNSIGNED');
	}//up()

	public function down() {
	  $this->remove_column('pet_types', 'id');
    $this->execute('ALTER TABLE pet_types '
      .'DROP KEY pet_types_species_color, '
      .'ADD PRIMARY KEY (species_id, color_id), '
      .'ADD asset_ids TINYTEXT NOT NULL');
      
    $this->remove_column('swf_assets', 'pet_type_id');
	}//down()
}
?>
