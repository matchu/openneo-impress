<?php
class Pwnage_SwfAsset extends PwnageCore_DbObject {
  const RemoteUrlRegex = '%^http://images.neopets.com/cp/(items|bio|audio)/(swf|data)/([0-9]{3}/[0-9]{3}/[0-9]{3})/([0-9]+_[0-9a-f]+\.(swf|mp3))$%';
  static $table = 'swf_assets';
  static $columns = array('type', 'id', 'url', 'zone_id', 'zones_restrict',
    'body_id');
  
  public function __construct($data=null) {
    if($data) {
      $this->zone_id = $data->zone_id;
      $this->url = $data->asset_url;
    }
  }
  
  protected function getBodyId() {
    return $this->body_id;
  }
  
  public function getLocalPath() {
    $components = $this->getLocalPathComponents();
    return $components[1];
  }
  
  public function getLocalPathComponents() {
    if(preg_match(self::RemoteUrlRegex, $this->url, $url_matches)) {
      $dir = '/assets/swf/outfit/'.$url_matches[1].'/'.$url_matches[3];
      $file = $dir.'/'.$url_matches[4];
      return array($dir, $file);
    } else {
      return false;
    }
  }
  
  public function getId() {
    return $this->id;
  }
  
  public function getParent() {
    return $this->parent;
  }
  
  public function getParentId() {
    if(!$this->parent_id) {
      $this->parent_id = $this->parent->getId();
    }
    return $this->parent_id;
  }
  
  public function getZone() {
    return $this->zone;
  }
  
  public function overlayHTML() {
    return "<li data-zone-id='$this->zone_id' "
      ."data-zone-depth='".$this->getZone()->depth."' "
      ."data-asset-url='$this->url'>"
      ."Zone $this->zone_id: $this->url"
      ."</li>";
  }
  
  public function saveFile() {
    if(list($dir, $file) = $this->getLocalPathComponents()) {
      $local_dir = PWNAGE_ROOT.'/www'.$dir;
      $local_file = PWNAGE_ROOT.'/www'.$file;
      if(!file_exists($local_file)) {
        $old_umask = umask();
        umask(0);
        if(!file_exists($local_dir)) {
          mkdir($local_dir, 0777, true);
        }
        $ch = curl_init($this->url);
        
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $data = curl_exec($ch);
        curl_close($ch);
        
        if($data === false) {
          throw new Pwnage_SwfAssetRemoteFileNotFoundException(
            curl_error($ch)
          );
        } else {
          file_put_contents($local_file, $data);
        }
        umask($old_umask);
      }
    } else {
      throw new Pwnage_SwfAssetRemoteFileNotFoundException('Bad URL format: '.$this->url);
    }
  }
  
  public function setOriginPetType($pet_type) {
    $this->body_id = $pet_type->getBodyId();
  }
  
  public function setParent($parent) {
    $this->parent = $parent;
  }
  
  static function all($options=array(), $table=null, $subclass=__CLASS__) {
    if(!$table) $table = self::$table;
    if(!$options['select']) $options['select'] = 'zone_id, url';
    return parent::all($options, $table, $subclass);
  }
  
  static function find($id, $options) {
    return parent::find($id, $options, self::$table, __CLASS__);
  }
  
  static function preloadZonesForCollection($assets, $options=array()) {
    $assets_by_zone = array();
    $assets_needing_zones = 0;
    foreach($assets as &$asset) {
      if($asset->zone) continue;
      $assets_by_zone[$asset->zone_id][] = &$asset;
      $assets_needing_zones++;
    }
    if($assets_needing_zones > 1) {
      $options = array_merge(array(
        'select' => 'id, depth',
        'where' => 'id IN ('.implode(', ', array_keys($assets_by_zone)).')'
      ), $options);
      $zones = Pwnage_Zone::all($options);
      foreach($zones as &$zone) {
        foreach($assets_by_zone[$zone->id] as &$asset) {
          $asset->zone = &$zone;
        }
      }
    }
  }
  
  static function saveCollection($assets) {
    self::preloadZonesForCollection($assets, array(
      'select' => 'id, depth, type_id'
    ));
    $object_assets_by_body_id_and_parent_id = array();
    $relationships = array();
    foreach($assets as $asset) {
      $relationships[] =
        new Pwnage_ParentSwfAssetRelationship($asset);
      if($asset->type == 'object') {
        $object_assets_by_body_id_and_parent_id[$asset->getBodyId()][$asset->getParentId()][] = $asset;
      }
      $asset->saveFile();
    }
    $delete_where_clause = array();
    foreach($object_assets_by_body_id_and_parent_id as $body_id => $assets_by_parent_id) {
      $delete_where_subclause = array();
      foreach($assets_by_parent_id as $parent_id => $assets_for_parent_id) {
        $parent_id = (int) $parent_id;
        $asset_ids = array();
        foreach($assets_for_parent_id as $asset) {
          $asset_ids[] = (int) $asset->getId();
        }
        $asset_ids_str = implode(',', $asset_ids);
        $delete_where_subclause[] = "(parent_id = $parent_id AND swf_asset_id NOT IN ($asset_ids_str))";
      }
      $delete_where_clause[] = "(body_id IN ($body_id, 0) AND (" . implode(' OR ', $delete_where_subclause) . "))";
    }
    $delete_where_clause_str = 'type = "object" AND ' . implode(' OR ', $delete_where_clause);
    $delete_query = "DELETE FROM psa USING swf_assets sa INNER JOIN " .
      "parents_swf_assets psa ON sa.id = psa.swf_asset_id WHERE " .
      $delete_where_clause_str;
    $db = PwnageCore_Db::getInstance();
    $db->beginTransaction();
    try {
      $db->exec($delete_query);
      parent::saveCollection($assets, self::$table, self::$columns);
      Pwnage_ParentSwfAssetRelationship::saveCollection($relationships);
    } catch(PDOException $e) {
      $db->rollBack();
      throw $e;
    }
    $db->commit();
  }
  
  static function getAssetsByParents($type, $parent_ids, $options) {
    $parent_ids = implode(', ', array_map('intval', $parent_ids));
    $where = Pwnage_SwfAsset::mergeConditions(
      "swf_assets.type = \"$type\" AND parents_swf_assets.parent_id IN ($parent_ids)",
      $options['where']
    );
    return Pwnage_SwfAsset::all(array(
      'select' => $options['select'],
      'joins' => 'INNER JOIN parents_swf_assets ON '
                .'parents_swf_assets.swf_asset_type = swf_assets.type AND '
                .'parents_swf_assets.swf_asset_id = swf_assets.id '.$options['joins'],
      'where' => $where
    ));
  }
  
  static function setLocalPathForCollection(&$assets) {
    foreach($assets as $asset) {
      $asset->local_path = $asset->getLocalPath();
    }
  }
}

class Pwnage_SwfAssetRemoteFileNotFoundException extends Exception {}
?>
