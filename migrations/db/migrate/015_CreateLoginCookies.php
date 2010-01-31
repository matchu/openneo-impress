<?php

class CreateLoginCookies extends Ruckusing_BaseMigration {

	public function up() {
    $this->execute('CREATE TABLE login_cookies ('.
      'id INT UNSIGNED NOT NULL AUTO_INCREMENT, '.
      'user_id INT UNSIGNED NOT NULL, '.
      'series INT UNSIGNED NOT NULL, '.
      'token INT UNSIGNED NOT NULL, '.
      'PRIMARY KEY (id), '.
      'INDEX login_cookies_user_id (user_id), '.
      'INDEX login_cookies_user_id_and_series (user_id, series)'.
    ')');
	}//up()

	public function down() {
    $this->drop_table('login_cookies');
	}//down()
}
?>
