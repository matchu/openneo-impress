<?php

class CreateUsers extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute('CREATE TABLE users ('.
      'id INT UNSIGNED NOT NULL AUTO_INCREMENT, '.
      'name VARCHAR(20) NOT NULL, '.
      'auth_server_id TINYINT UNSIGNED NOT NULL, '.
      'remote_id INT UNSIGNED NOT NULL, '.
      'PRIMARY KEY (id)'.
    ')');
	}//up()

	public function down() {
    $this->drop_table('users');
	}//down()
}
?>
