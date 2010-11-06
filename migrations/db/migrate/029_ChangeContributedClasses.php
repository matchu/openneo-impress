<?php

class ChangeContributedClasses extends Ruckusing_BaseMigration {

  public function up() {
    $this->execute(
      'ALTER TABLE contributions '.
      'MODIFY COLUMN contributed_class '.
      'VARCHAR(18) NOT NULL'
    );
    $this->execute(
      'UPDATE contributions SET contributed_class = "Item" '.
      'WHERE contributed_class = "Pwnage_Object"'
    );
    $this->execute(
      'UPDATE contributions SET contributed_class = "SwfAsset" '.
      'WHERE contributed_class = "Pwnage_ObjectAsset"'
    );
    $this->execute(
      'UPDATE contributions SET contributed_class = "PetType" '.
      'WHERE contributed_class = "Pwnage_PetType"'
    );
    $this->execute(
      'UPDATE contributions SET contributed_class = "PetState" '.
      'WHERE contributed_class = "Pwnage_PetState"'
    );
    $this->execute(
      'ALTER TABLE contributions '.
      'MODIFY COLUMN contributed_class '.
      'ENUM("Item", "SwfAsset", "PetType", "PetState") NOT NULL'
    );
  }//up()

  public function down() {
    $this->execute(
      'ALTER TABLE contributions '.
      'MODIFY COLUMN contributed_class '.
      'VARCHAR(18) NOT NULL'
    );
    $this->execute(
      'UPDATE contributions SET contributed_class = "Pwnage_Object" '.
      'WHERE contributed_class = "Item"'
    );
    $this->execute(
      'UPDATE contributions SET contributed_class = "Pwnage_ObjectAsset" '.
      'WHERE contributed_class = "SwfAsset"'
    );
    $this->execute(
      'UPDATE contributions SET contributed_class = "Pwnage_PetType" '.
      'WHERE contributed_class = "PetType"'
    );
    $this->execute(
      'UPDATE contributions SET contributed_class = "Pwnage_PetState" '.
      'WHERE contributed_class = "PetState"'
    );
    $this->execute(
      'ALTER TABLE contributions '.
      'MODIFY COLUMN contributed_class '.
      'ENUM("Pwnage_PetState", "Pwnage_PetType", "Pwnage_Object", "Pwnage_ObjectAsset") NOT NULL'
    );
  }//down()
}
?>
