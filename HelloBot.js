const scriptName = "HelloBot";
const operArr = ["지도","날씨","퇴근","help","?"];
const cityDicK = ["도쿄","오사카","나고야","요코하마","토치기","치바","서울","대전","대구","부산","광주","인천","울산"];
const cityDicE = ["Tokyo","Osaka","Nagoya","Yokohama","Tochigi","Chiba","Seoul","Daejeon","Daegu","Busan","Gwangju","Incheon","Ulsan"];
const API_KEY = "plese insert API Key"
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */

var wrongOperation = (function(){
  return function(replier){
    replier.reply("명령이 올바르지 않습니다.\n/? 또는 /help 명령어를 통하여 사용가능한 명령어를 확인할 수 있습니다.");
  };
})();
 
var calRemainTime = (function(){
  return function(keyword,replier){
    
  };
})();
 
var searchBroadCast = (function(){
  return function(keyword,replier){
      var str = keyword.split(" ");
      if(cityDicK.indexOf(str[0])!==-1){
              fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_KEY}`);        
      }
      else{
        wrongOperation(replier);
      }
  };
})();

var searchOnMap = (function() {
  return function(keyword, replier) {
  var baseURL = "https://www.google.com/maps/search/?api=1&query=";
  var keywordArr = keyword.split(" ");
  for (var i = 0; i < keywordArr.length; i++) {
    baseURL += "+" + keywordArr[i];
  }
  replier.reply("검색하신 " + keyword + "의 구글맵 검색결과입니다.\n" + baseURL);
};
})();

var botWork = (function() {
  return function(operation, keyword, replier) {
  switch (operation) {
    case operArr[0]:
      searchOnMap(keyword, replier);
      break;
    case operArr[1]:
      searchBroadCast(keyword,replier);
      break;
    case operArr[2]:
      calRemainTime(keyword,replier);
      break;
    case operArr[3]:
    case operArr[4]:
      replier.reply("사용가능한 명령어 : \n/지도 검색어 \n/날씨 검색위치 \n/퇴근 퇴근시간");
      break;
    default:
      wrongOperation(replier);
      break;
  }
};
})();

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  // '/'을 통한 명령어 인식.
  // operation : 명령어
  // keyword : 검색어
  //문자열 쪼개기 에러 방지를 위한 try~catch구문
  try {
    if (msg.charAt(0) === '/') {
      let str = msg.split(" ");
      let operation = str[0].substring(1).toLowerCase();
      let keyword = msg.substring(msg.indexOf(" ") + 1);
      botWork(operation, keyword, replier);
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
