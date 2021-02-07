const scriptName = "alarmBot";
const API_KEY = JSON.parse(DataBase.getDataBase("apikey.json"));

var Runnable = java.lang.Runnable;    //Runnable 객체가 java.lang.Runnable 클래스 상속 받음
var Thread = java.lang.Thread;        //Thread 객체가 java.lang.Thread 클래스 상속 받음
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */
 /*
 test 객체가 Thread 메소드를 상속받음(extend)과 동시에
 Rannable 실행객체를 implements 형식으로 다중상속 받아
 스레드로 실행시킬 run() 함수 구현
 즉 자바의 Rannable 객체를 활용한 스레드 구현
 */
alarmOn();
function alarmOn(){
 var test = new Thread(new Runnable({
     run:function(){
       var date = new Date();
       if(date.getHours()==7&&date.getMinutes()==0){
         var SHOWDAY = 13;
         var weather_jstr = Utils.getWebText("https://api.openweathermap.org/data/2.5/onecall?lat=35.6894875&lon=139.6917064&exclude=daily,minutely&appid="+
                    API_KEY.OPENWEATHER+"&units=metric&lang=kr",
                   "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",false,false).replace(/(<([^>]+)>)/g, "").trim();
         var weather_jinfo = JSON.parse(weather_jstr);
         var str = "현재 기온 : "+weather_jinfo.current.temp+"도\n"
                   +"현재 날씨 : "+weather_jinfo.current.weather[0].description;

         for(var i=4;i<SHOWDAY;i+4){
           var now = new Date(weather_jinfo.hourly[i].dt*1000);
           str += "\n"+now.getHours()+"시 기온 : "+weather_jinfo.hourly[i].temp+"도 "
                    +"날씨 : "+weather_jinfo.hourly[i].weather[0].description;
         }

         Api.replyRoom("TMW",str);
       }
     }
 }));
 test.start();
}



function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {

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
