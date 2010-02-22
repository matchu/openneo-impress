#!/usr/bin/php
<?php
require_once dirname(__FILE__).'/../pwnage/environment.php';
$db = PwnageCore_Db::getInstance();
$fetch_stmt = $db->query(
  'SELECT user_id, contributed_class, count(*) as count FROM contributions '.
  'GROUP BY user_id, contributed_class'
);
$current_user_contribution_set = array();

function awardPoints() {
  global $db, $current_user_id, $current_user_contribution_set, $update_stmt;
  $points = Pwnage_Contribution::getPointsFromContributionSet($current_user_contribution_set);
  $update_stmt->execute(array($points, $current_user_id));
  echo "User $current_user_id now has $points points\n";
}
try {
  $db->beginTransaction();
  $update_stmt = $db->prepare('UPDATE users SET points = ? WHERE id = ?');
  $db->exec('UPDATE users SET points = 0');
  while($row = $fetch_stmt->fetch(PDO::FETCH_ASSOC)) {
    if(isset($current_user_id) && $current_user_id != $row['user_id']) {
      awardPoints();
      $current_user_contribution_set = array();
    }
    $current_user_id = $row['user_id'];
    $current_user_contribution_set[$row['contributed_class']] = $row['count'];
  }
  awardPoints();
  $db->commit();
} catch(PDOException $e) {
  $db->rollBack();
  echo 'Database error, rolling back';
  throw $e;
}
?>
