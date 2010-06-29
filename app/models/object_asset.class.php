<?php
class Pwnage_ObjectAsset extends Pwnage_SwfAsset {
  const assetServer = 'http://images.neopets.com/';
  const mallSpiderUrl = 'http://ncmall.neopets.com/mall/ajax/get_item_assets.phtml?pet=%s&oii=%s&prev_count=1';
  const mallSpiderConnectionAttempts = 5;
  const mallSpiderRetryDelay = 5;
  const mallSpiderSaveLimit = 100;
  public $type = 'object';
  
  public function __construct($data=null) {
    if($data) {
      $this->id = $data->asset_id;
      $this->parent_id = $data->obj_info_id;
    }
    parent::__construct($data);
  }
  
  protected function beforeSave() {
    if($this->isBodySpecific()) {
      $count_existing_with_other_body_id = self::count(array(
        'where' => array('id = ? AND body_id != ?', $this->id, $this->body_id)
      ));
      if($count_existing_with_other_body_id) {
        $this->body_id = null;
      }
    } else {
      $this->body_id = null;
    }
  }
  
  public function getZone() {
    return $this->zone;
  }
  
  public function isBodySpecific() {
    return $this->body_id == null || $this->getZone()->type_id < 3;
  }
  
  public function setDataFromMall($data) {
    $this->zone_id = $data->zone;
    $this->parent_id = $data->oii;
    $this->url = self::assetServer.$data->url;
  }
  
  public function setBodyId($body_id) {
    $this->body_id = $body_id;
  }
  
  public function setId($id) {
    $this->id = $id;
  }
  
  public function setZone($zone) {
    $this->zone = $zone;
  }
  
  static function all($options) {
    $options['where'] = self::mergeConditions($options['where'],
      array(self::$table.'.type = ?', 'object')
    );
    return parent::all($options, self::$table, __CLASS__);
  }
  
  static function count($options) {
    $options['where'] = self::mergeConditions($options['where'],
      array(self::$table.'.type = ?', 'object')
    );
    return parent::count($options, self::$table);
  }
  
  static function getAssetsByParents($parent_ids, $options) {
    return parent::getAssetsByParents('object', $parent_ids, $options);
  }
  
  static function rejectExistingInCollection($objects) {
    return parent::rejectExistingInCollection($objects, self::$table);
  }
  
  static function spiderMall($limit=100, $colors=false, $objects=false) {
    // SECURITY: $colors and $objects are trusted to be [0-9]+ and commas.
    // Do NOT accept user input for this function before sanitizing!
    //
    // The combination-finding query used to be one really, really slow one,
    // but since MySQL's query optimizer is broken, we managed to speed it up
    // very, very, very much by pulling out the subquery into a separate query.
    if(!$colors) $colors = implode(',', Pwnage_Color::getStandardIds());
    echo "Finding combinations to search for...\n";
    $where = array('swf_asset_type = ?', 'object');
    if($objects) {
      self::mergeConditions($where, array(
        "parent_id IN ($objects)"
      ));
    }
    $relationships = Pwnage_ParentSwfAssetRelationship::all(array(
      'select' => 'DISTINCT parent_id, body_id',
      'joins' => 'INNER JOIN swf_assets ON swf_assets.id = parents_swf_assets.swf_asset_id',
      'where' => $where
    ));
    $objects_with_assets = array();
    $combinations_with_assets = array();
    foreach($relationships as $relationship) {
      if($relationship->body_id == 0) {
        $objects_with_assets[] = $relationship->parent_id;
      } else {
        $combinations_with_assets[] = "($relationship->parent_id, $relationship->body_id)";
      }
    }
    unset($relationships);
    $objects_with_assets_str = implode(', ', $objects_with_assets);
    $combinations_with_assets_str = implode(', ', $combinations_with_assets);
    unset($combinations_with_assets);
    $db = PwnageCore_Db::getInstance();
    $where = <<<SQL
      pt.color_id IN ($colors) AND
      o.id NOT IN ($objects_with_assets_str) AND
      (o.id, pt.body_id) NOT IN ($combinations_with_assets_str) AND
      o.sold_in_mall = 1
SQL;
    if($objects) $where .= " AND o.id IN ($objects)";
    $combination_stmt = $db->prepare(<<<SQL
      SELECT o.id, o.name, p.name, p.id, pt.id, pt.color_id, pt.species_id,
        o.zones_restrict, pt.body_id
      FROM objects o, pet_types pt
      INNER JOIN pets p ON p.pet_type_id = pt.id
      WHERE $where
      GROUP BY o.id, pt.body_id
      ORDER BY o.last_spidered ASC
      LIMIT $limit
SQL
    );
    $combination_stmt->execute();
    for($round=0;$round<$limit;$round+=self::mallSpiderSaveLimit) {
      $object_ids = array();
      $zones_restrict_updates = array();
      $assets = array();
      $current_object_id = false;
      $current_object_is_body_specific = true;
      $zones_by_id = array();
      foreach(Pwnage_Zone::all() as $zone) {
        $zones_by_id[$zone->id] = $zone;
      }
      for(
        $object_in_round=0;
        $object_in_round<self::mallSpiderSaveLimit && $row = $combination_stmt->fetch(PDO::FETCH_NUM);
        $object_in_round++
      ) {
        list($object_id, $object_name, $pet_name, $pet_id, $pet_type_id,
          $color_id, $species_id, $zones_restrict, $body_id) = $row;
        if($object_id != $current_object_id) {
          $current_object_id = $object_id;
          $object_ids[] = $object_id;
          $current_object_is_body_specific = true;
        }
        if(!$current_object_is_body_specific) continue;
        $pet = new Pwnage_Pet();
        $pet->name = $pet_name;
        $pet->id = $pet_id;
        unset($pet_exists);
        for($i=0;!isset($pet_exists);$i++) {
          try {
            $pet_exists = $pet->exists();
          } catch(Pwnage_AmfConnectionError $e) {
            if($i+1 < self::mallSpiderConnectionAttempts) {
              echo "Error getting pet data, trying again in ".
                self::mallSpiderRetryDelay." seconds\n";
              sleep(self::mallSpiderRetryDelay);
            } else {
              throw new Exception("Connection attempts used up - connecting not possible.");
            }
          }
        }
        do {
          echo "Round $round #$object_in_round: Checking $pet_name's integrity...\n";
          if(!$pet_exists) {
            throw new Exception("Data integrity error: pet $pet_name no longer exists.");
          }
          $has_unexpected_attributes = $pet->getSpecies()->getId() != $species_id ||
            $pet->getColor()->getId() != $color_id;
          if($has_unexpected_attributes)
          {
            echo "$pet_name failed integrity check; saving new data...\n";
            $pet->update();
            $pet = Pwnage_Pet::first(array(
              'select' => 'name, species_id, color_id',
              'where' => array('pet_type_id = ?', $pet_type_id)
            ));
          }
        } while($has_unexpected_attributes);
        echo "$pet_name passed integrity check; modeling for $object_name...\n";
        $url = sprintf(self::mallSpiderUrl, $pet_name, $object_id);
        $json = HttpRequest::getJson($url);
        $data = $json->$object_id->asset_data;
        echo "Got asset data\n";
        if($data) { // could be a bad body type
          foreach($data as $asset_id => $asset_data) {
            $asset = new Pwnage_ObjectAsset();
            $asset->setId($asset_id);
            $asset->setBodyId($body_id);
            $asset->setDataFromMall($asset_data);
            $asset->setZone($zones_by_id[$asset_data->zone]);
            $assets[] = $asset;
            echo "Asset #$asset->id set to save\n";
            if($zones_restrict != $asset_data->restrict) {
              $zones_restrict_updates[$object_id] = $asset_data->restrict;
              echo "Will update $object_name's zones_restrict on complete\n";
            }
            $current_object_is_body_specific = $asset->isBodySpecific();
          }
        } else {
          echo "Data doesn't fit. Bad body type?\n";
        }
        if(!$current_object_is_body_specific) {
          echo "Object not body-specific; our job here is done.\n";
        }
      }
      echo "About to save ".count($assets)." assets...\n";
      Pwnage_ObjectAsset::saveCollection($assets);
      echo "About to update ".count($zones_restrict_updates)." object zone restricts\n";
      $stmt = $db->prepare('UPDATE objects SET zones_restrict = ? WHERE id = ?');
      foreach($zones_restrict_updates as $object_id => $zones_restrict) {
        $stmt->execute(array($zones_restrict, $object_id));
      }
      echo "About to update ".count($object_ids)." last spidered timestamps\n";
      $stmt = $db->prepare('UPDATE objects SET last_spidered = FROM_UNIXTIME(?) WHERE id IN ('.
        implode(',', $object_ids).')');
      $stmt->execute(array(time()));
    }
  }
}
?>
