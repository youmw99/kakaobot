const scriptName = "ThuyBot";
const ROOMNAME = ["TMW"];
const detectVI = new RegExp(/[a-zA-z]/);
const detectKO = new RegExp(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/);
const resultLan = ["vi","ko"];
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */
 
var botWorkTMW = (function(){
  return function(msg, sender, replier){
    if(detectVI.test(msg)){
      let str = Api.papagoTranslate(resultLan[0],resultLan[1],msg);
      replier.reply(str);
    }
    else if(detectKO.test(msg)){
      let str = Api.papagoTranslate(resultLan[1],resultLan[0],msg);
      replier.reply(str);
    }
  };
})();
 
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  try {
    if (room==="TMW") {
      botWorkTMW(msg, sender, replier);
    }
  }  catch (err) {
  replier.reply(err);
  }
}
//아래 4개의 메소드는 액티비티 화면을 수정할때 사용됩니다.
function onCreate(savedInstanceState, activity) {
  var textView = new android.widget.TextView(activity);
  textView.setText("Hello, World!");
  textView.setTextColor(android.graphics.Color.DKGRAY);
  activity.setContentView(textView);
}

function onStart(activity) {}

function onResume(activity) {}

function onPause(activity) {}

function onStop(activity) {}