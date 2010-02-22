<?php
// Class definition for wearable objects, since that's what Neo calls them.
// We're not talking about, like, stdClass-type objects.

class Pwnage_Object extends Pwnage_SwfAssetParent {
  const mallCatUrl = 'http://ncmall.neopets.com/mall/ajax/load_page.phtml?type=browse&cat=%s&lang=en';
  const mallIndex = 'http://ncmall.neopets.com/mall/shop.phtml';
  const mallItemUrl = 'http://images.neopets.com/items/%s.gif';
  const mallLinkRegex = '%^load_items_pane\([\'"]browse[\'"], ([0-9]+)\); swap_preview\([\'"]pet[\'"]\);$%';
  protected $asset_type = 'object';
  static $table = 'objects';
  static $columns = array('id', 'zones_restrict', 'thumbnail_url', 'name',
    'description', 'category', 'type', 'rarity', 'rarity_index', 'price',
    'weight_lbs', 'species_support_ids', 'sold_in_mall');
  
  public function __construct($data=null) {
    if($data) {
      foreach($data as $key => $value) {
        $this->$key = $value;
      }
      $this->id = $data->obj_info_id;
    }
  }
  
  protected function beforeSave() {
    if($this->species_support) {
      $this->species_support_ids = implode(',', $this->species_support);
    }
  }
  
  public function getAssets($query_options=array()) {
    if(!$this->preloaded_assets && !$this->assets) {
      if($this->assets_by_zone) {
        $this->assets = array();
        foreach($this->assets_by_zone as $asset_id) {
          $asset_data = $this->asset_registry[$asset_id]->getAMFData();
          $asset = new Pwnage_ObjectAsset($asset_data);
          $asset->setOriginPetType($this->origin_pet_type);
          $this->assets[] = $asset;
        }
      } else {
        $query_options['where'] = self::mergeConditions(
          $query_options['where'],
          'parent_id = '.intval($this->id)
        );
        $this->assets = Pwnage_ObjectAsset::all($query_options);
      }
    }
    return $this->assets;
  }
  
  public function getId() {
    return $this->id;
  }
  
  public function getName() {
    return $this->name;
  }
  
  public function getThumbnailUrl() {
    return $this->thumbnail_url;
  }
  
  public function isBodySpecific() {
    $is_specific = true;
    foreach($this->getAssets() as $asset) {
      $is_specific = $is_specific && $asset->isBodySpecific();
    }
    return $is_specific;
  }
  
  public function needsToLoadAssets() {
    return !$this->preloaded_assets && empty($this->assets_by_zone) &&
      empty($this->assets);
  }
  
  public function setAssetRegistry($registry) {
    $this->asset_registry = &$registry;
  }
  
  public function setAssetOrigin($pet) {
    foreach($this->assets as $asset) {
      $asset->body_id = $pet->getBodyId();
    }
  }
  
  public function setOriginPetType($pet_type) {
    $this->origin_pet_type = &$pet_type;
  }
  
  static function all($options=array()) {
    return parent::all($options, self::$table, __CLASS__);
  }
  
  static function find($id, $options=array()) {
    return parent::find($id, $options, self::$table, __CLASS__);
  }
  
  static function rejectExistingInCollection($objects) {
    return parent::rejectExistingInCollection($objects, self::$table);
  }
  
  static function saveCollection($objects) {
    parent::saveCollection($objects, self::$table, self::$columns);
  }
  
  static function spiderMall() {
    require_once 'phpQuery.php';
    echo 'Loading '.self::mallIndex."\n";
    $shop_html = HttpRequest::get(self::mallIndex);
    // When php5 is compiled correctly, tidy is available by default.
    // We need to clean up the mall's HTML here, or else we can't parse it.
    $tidy = new tidy();
    $shop_html = $tidy->repairString($shop_html);
    $shop = phpQuery::newDocumentHTML($shop_html);
    unset($shop_html);
    $cats = array();
    foreach(pq('#nc_cat_nav a', $shop) as $link) {
      $onclick = $link->getAttribute('onclick');
      if(preg_match(self::mallLinkRegex, $onclick, $matches)) {
        $cats[] = $matches[1];
      }
    }
    unset($shop);
    echo 'Found '.count($cats)." categories to check\n";
    $objects = array();
    foreach($cats as $cat) { // meow
      $url = sprintf(self::mallCatUrl, $cat);
      echo "Loading $url\n";
      $data = HttpRequest::get($url);
      $objects = array_merge($objects, self::spiderMallCat($data));
    }
    self::saveCollection($objects);
    echo "Saved objects\n";
  }
  
  static function spiderMallCat($data) {
    $objects = array();
    $object_datas = json_decode($data)->object_data;
    foreach($object_datas as $object_data) {
      if($object_data->isWearable) {
        // FIXME: this find could be compressed into one on save time...
        $existing_object = self::find($object_data->id, array(
          'where' => array('sold_in_mall = ?', 1)
        ));
        if($existing_object) {
          $verb = 'Skipped';
        } else {
          $object = new Pwnage_Object();
          $object->id = $object_data->id;
          $object->name = $object_data->name;
          $object->description = $object_data->description;
          $object->thumbnail_url = sprintf(self::mallItemUrl,
            $object_data->imageFile);
          $object->sold_in_mall = 1;
          $objects[] = $object;
          $verb = 'Will save';
        }
        echo "$verb object #$object_data->id: $object_data->name\n";
      }
    }
    return $objects;
  }
}
?>
