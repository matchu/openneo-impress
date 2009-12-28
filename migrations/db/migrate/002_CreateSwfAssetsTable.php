<?php

class CreateSwfAssetsTable extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute('CREATE TABLE swf_assets('
    .'type ENUM("biology", "object") NOT NULL,'
    .'id MEDIUMINT UNSIGNED NOT NULL,'
    .'url TEXT NOT NULL,'
    .'zone_id TINYINT UNSIGNED NOT NULL,'
    .'zones_restrict TINYTEXT NOT NULL,'
    .'PRIMARY KEY (type, id)'
    .')');
	}//up()

	public function down() {
    $this->drop_table('swf_assets');
	}//down()
}
?>
