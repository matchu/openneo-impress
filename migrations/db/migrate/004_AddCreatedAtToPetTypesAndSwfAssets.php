<?php

class AddCreatedAtToPetTypesAndSwfAssets extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute('ALTER TABLE pet_types '
      .'ADD created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'
    );
    $this->execute('ALTER TABLE swf_assets '
      .'ADD created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'
    );
	}//up()

	public function down() {
    $this->remove_column('pet_types', 'created_at');
    $this->remove_column('swf_assets', 'created_at');
	}//down()
}
?>
