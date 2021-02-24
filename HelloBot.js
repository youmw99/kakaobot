const scriptName = "HelloBot";
const operArr = ["지도","날씨","퇴근","help"];
const API_KEY = JSON.parse(DataBase.getDataBase("apikey.json"));

/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */

var translateIt = (function(){
  var str = "";
  return function(operation,keyword){
    try{
      var lanobj = {
      한 : 'ko', 영 : 'en', 일 : 'ja',
      중 : 'zh-CN', 베 : 'vi', 인 : 'id',
      태 : 'th', 독 : 'de', 러 : 'ru',
      스 : 'es', 이 : 'it', 프 : 'fr'
      };
      str = Api.papagoTranslate('ko',lanobj[operation],keyword);
    }
    catch(err){
      str = "혹시 명령어를 잘못 입력하지 않으셨나요?\n"+
                    "번역 명령어는 다음과 같이 입력할 수 있습니다.\n\n"+
                    "예)!일 안녕하세요\n"+
                    "파파고에서 서비스하는 모든 언어를 이용하실 수 있습니다!";
    }
    return str;
  };
})();

var calRemainTime = (function(){
  return function(keyword,replier){
    var date = new Date();
    var str = "";
    var hours = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    var strexp = keyword.replace(/[^0-9]/g,"");
    var leftHours = str.substring(0,2)*1-hours;
    var leftMin = str.substring(2,4)*1-min;

    if(strexp.length!==4){
     str = "정규 퇴근 시간을 입력해주세요\n예)18:00 혹은 1800";
    }
    else if(leftHours<0||leftHours==0&&leftMin<0){
     str = Math.abs(leftHours)+"시간 "+Math.abs(leftMin)+"분 째 야근중이시네요 풉ㅋ풉ㅋ";
    }
    else{
     str = leftMin<0?"퇴근까지 "+(leftHours-1)+"시간 "+(60+leftMin)+"분 남았습니다.\n힘내세요!":
     "퇴근까지 "+leftHours+"시간 "+leftMin+"분 남았습니다.\n힘내세요!";
    }
    return str;
  };
})();

var searchBroadCast = (function(){
  var toStringWeather = function(weather_jinfo){
    const SHOWDAY = 3;
    var str = "현재 기온 : "+weather_jinfo.current.temp+"도\n"
              +"현재 날씨 : "+weather_jinfo.current.weather[0].description;
    for(var i=0;i<SHOWDAY;i++){
      str += "\n"+i+"일 후 기온 : "+weather_jinfo.daily[i].temp.day+"도 "
               +"날씨 : "+weather_jinfo.daily[i].weather[0].description;
    }
    return str;
  };
  return function(keyword){
      var str = "";
      var strexp = keyword.replace(/\s/,"+");
      var google_jstr = Utils.getWebText("https://maps.googleapis.com/maps/api/geocode/json?address="+strexp+"&key="+API_KEY.GOOGLE,
              "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",false,false).replace(/(<([^>]+)>)/g, "").trim();
      var google_jinfo = JSON.parse(google_jstr);
      var weather_jstr = Utils.getWebText("https://api.openweathermap.org/data/2.5/onecall?lat="
              +google_jinfo.results[0].geometry.location.lat+"&lon="+google_jinfo.results[0].geometry.location.lng
              +"&exclude=minutely,hourly&appid="+API_KEY.OPENWEATHER+"&units=metric&lang=kr",
              "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",false,false).replace(/(<([^>]+)>)/g, "").trim();
      var weather_jinfo = JSON.parse(weather_jstr);
      var weather_result = toStringWeather(weather_jinfo);
      str = keyword+"의 날씨 검색결과입니다.\n"+weather_result;
      return str;
  };
})();

var searchOnMap = (function() {
  return function(keyword) {
    var baseURL = "https://www.google.com/maps/search/?api=1&query=";
    var strexp = keyword.replace(/\s/,"+");
    baseURL += strexp;
  return "검색하신 " + keyword + "의 구글맵 검색결과입니다.\n" + baseURL;
  };
})();

var botWork = (function() {
  var wrongOperation = function(){
    return "혹시 명령어를 올바르게 입력하셨나요?\n"+
                    "/help 명령어를 통하여 사용가능한 명령어를 확인할 수 있습니다."+
                    "\n(예 : !지도 검색어)\n";
  }
  return function(operation, keyword, replier) {
    var str = "";
    if(operation.length===1){
      str = translateIt(operation,keyword);
    }
    else{
      switch (operation) {
        case operArr[0]:
          str = searchOnMap(keyword);
          break;
        case operArr[1]:
          str = searchBroadCast(keyword);
          break;
        case operArr[2]:
        str = calRemainTime(keyword);
          break;
        case operArr[3]:
          str = "사용가능한 명령어 : \n"+
                        operArr+"\n"+
                        "번역의 경우 :\n !번역대상언어 내용";
          break;
        default:
          str = wrongOperation();
          break;
    }
  }
  replier.reply(str);
};
})();

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  // '/'을 통한 명령어 인식.
  // operation : 명령어
  // keyword : 검색어
  //문자열 쪼개기 에러 방지를 위한 try~catch구문
  try {
    if (msg.charAt(0) === '!') {
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
