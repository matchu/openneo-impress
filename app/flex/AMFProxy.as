package {
  import flash.display.Sprite;
  import flash.external.ExternalInterface;
  import flash.net.NetConnection;
  import flash.net.ObjectEncoding;
  import flash.net.Responder;
  public class AMFProxy extends Sprite {
    // not sure why it needs to be a sprite for externalinterface to work,
    // but that's what i found.
    // TODO: figure out why?
    
    private var conn:NetConnection;
    
    public function AMFProxy() {
      conn = new NetConnection();
      conn.objectEncoding = ObjectEncoding.AMF0;
      conn.connect("http://www.neopets.com/amfphp/gateway.php");
      ExternalInterface.addCallback('requestKeys', requestKeys);
    }
    
    private function requestKeys(args:Array, keys:Array):void {
      var externalCallback:String = args[1];
      var onSuccess:Function = function(result:Object):void {
        for(var i:String in keys) {
          result = result[keys[i]];
        }
        var outKeys:Array = [];
        for(var outKey:Object in result) {
          if(result[outKey] is Array) {
            outKey += " ("+result[outKey].length+")";
          }
          outKeys.push(outKey);
        }
        ExternalInterface.call(externalCallback, outKeys);
      }
      args[1] = new Responder(onSuccess, onError);
      conn.call.apply(null, args);
    }
    
    private function onError(obj:Object):void {
      ExternalInterface.call('amfError', obj);
    }
  }
}
