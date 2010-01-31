<?php

class CreateAuthServers extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute('CREATE TABLE auth_servers ('.
      'id TINYINT NOT NULL AUTO_INCREMENT, '.
      'short_name VARCHAR(10) NOT NULL, '.
      'name VARCHAR(40) NOT NULL, '.
      'icon TEXT NOT NULL, '.
      'gateway TEXT NOT NULL, '.
      'secret CHAR(64) NOT NULL, '.
      'PRIMARY KEY (id)'.
    ')');
	}//up()

	public function down() {
    $this->drop_table('auth_servers');
	}//down()
}
?>
