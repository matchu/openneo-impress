package {
  public class Asset {
    public var id:int;
    public var path:String;
    public var zone:int;
    
    public function Asset(data:Object) {
      id = data.id;
      zone = data.zone;
      path = data.path;
    }
  }
}
