const scriptName = "ThuyBot";
const ROOMNAME = ["TMW"];
const LANGPACK = [new RegExp(/[a-zA-z]/), new RegExp(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/), new RegExp(/[亜-熙ぁ-んァ-ヶ]/)];
const resultLan = ["vi", "ko", "ja"];
const skipMSG = ["사진을", "동영상을", "음성메시지를", "지도:", "파일:"];
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */
var botWorkTMW = (function() {
  var detectLan = function(msg) {
  var i = 0;
  for (i; i < LANGPACK.length; i++) {
    if (LANGPACK[i].test(msg)) {
      break;
    }
  }
  return i;
};
  return function(msg, sender, replier) {
  if (skipMSG.indexOf(msg.split(' ')[0] ) == -1) {
    var sourceLan = detectLan(msg);
    var str = '';
    switch (sourceLan) {
      case 0:
        str = Api.papagoTranslate(resultLan[sourceLan], 'ko', msg);
        break;
      case 1:
        str = Api.papagoTranslate(resultLan[sourceLan], 'vi', msg);
        break;
      case 2:
        str = Api.papagoTranslate(resultLan[sourceLan], 'ko', msg);
                (sender === 'YMW') ? str = Api.papagoTranslate('ko', 'vi', str) : Api.papagoTranslate('vi', 'ko', str);
        break;
    }
    replier.reply(str);
  }
  return 0;
};
})();
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  try {
    if (msg.charAt(0) !== "!" && room === "TMW") {
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
function onStart(activity) {
}
function onResume(activity) {
}
function onPause(activity) {
}
function onStop(activity) {
}
