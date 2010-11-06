<?php

class ChangeContributionContributedClassToContributedType extends Ruckusing_BaseMigration {

	public function up() {
    $this->rename_column('contributions', 'contributed_class', 'contributed_type');
	}//up()

	public function down() {
    $this->rename_column('contributions', 'contributed_type', 'contributed_class');
	}//down()
}
?>
