#!/usr/bin/php
<?php
require_once dirname(__FILE__).'/../pwnage/environment.php';
define('CORRECT_BODY_ID', 257);

$db = PwnageCore_Db::getInstance();
$ids = $db->query(<<<SQL
SELECT GROUP_CONCAT(DISTINCT sa1.id) FROM swf_assets sa1

LEFT JOIN parents_swf_assets psa1 ON sa1.id=psa1.swf_asset_id
LEFT JOIN parents_swf_assets psa2 ON psa1.parent_id=psa2.parent_id
LEFT JOIN swf_assets sa2 ON psa2.swf_asset_id=sa2.id

WHERE sa1.body_id = 0
  AND sa2.body_id != 0
  AND sa1.type = 'object'
  AND sa2.type = 'object'
  AND psa1.swf_asset_type = 'object'
  AND psa2.swf_asset_type = 'object'
SQL
)->fetch(PDO::FETCH_NUM);
$ids = $ids[0];

if($ids) {
  echo "Database named '$ids' as bugged\n";
  $rows_affected = $db->exec(
    'UPDATE swf_assets '.
    'SET body_id = '.CORRECT_BODY_ID.' '.
    'WHERE id IN ('.$ids.')'
  );
  echo "Patched $rows_affected rows\n";
} else {
  echo "Database says no SWF assets are bugged\n";
}
