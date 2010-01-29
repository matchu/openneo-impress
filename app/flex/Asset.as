package {
  public class Asset {
    public var depth:int;
    public var id:int;
    public var local_path:String;
    
    public function Asset(data:Object) {
      depth = data.depth;
      id = data.id;
      local_path = data.local_path;
    }
  }
}
