import { BrowserView, MobileView } from 'react-device-detect'
import React, {useEffect,useState, useRef} from 'react';
import firebase from "firebase/app";
import "firebase/messaging";
import './App.css';




const firebaseConfig =  { 
  apiKey: "AIzaSyA5WiIGCyRiwK8qRArE5AnLWlaP111sMSM",
    authDomain: "h-reminder.firebaseapp.com",
    projectId: "h-reminder",
    storageBucket: "h-reminder.appspot.com",
    messagingSenderId: "133453356675",
    appId: "1:133453356675:web:8abd694e7ca52b1fff85b6",
    measurementId: "G-50TD3GMM2X"
};

if (!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
  }
  
export const messaging = firebase.messaging();

function setfooddata(elements){
  if (elements.length > 0) {
    const newValues = [];
    elements.forEach((element) => {
      const listArray = [];
      let value = element.textContent;
      value = element.replace(/<br\/>/g, "\n");
      const nValue = value.split('\n');
      nValue.forEach((line) => {
        if (line.length > 18) {
          const naValue = line.split(' ');
          listArray.push(...naValue);
        } else {
          listArray.push(line);
        }
      });
      newValues.push(listArray);
    });
    return (newValues)
  } else {
    console.log("Elements not found.");
  }
}

const App = () => {
  const [data, setData] = useState('');
  const breakref = useRef(null);
  const lunchref = useRef(null);
  const dinnerref = useRef(null);

  useEffect(() => {
    if (firebase.messaging.isSupported()) {
      Notification.requestPermission()
        .then((permission) => {
          if (permission === 'granted') {
            console.log('Notification permission granted.');
            return messaging.getToken();
          } else {
            console.log('Unable to get permission to notify.');
          }
        })
        .then((token) => {
          console.log('Device token:', token);
        })
        .catch((error) => {
          console.log('Error requesting notification permission:', error);
        });
    } else {
      console.log('Firebase Messaging is not supported in this browser.');
      // 대체 방안 구현
    }
    const today = new Date();
    let dateformat = today.getFullYear()+((today.getMonth()+1) < 9 ? "0" + (today.getMonth()+1) : (today.getMonth()+1))+((today.getDate())<9?"0"+(today.getDate()):(today.getDate()));
    const url = 'https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=Q10&SD_SCHUL_CODE=8490107&KEY=06c2634b191d41d78a091f2df381bf25&MLSV_YMD='+dateformat;
    const tag = "DDISH_NM";
    fetch(url)
            .then(response => response.text())
            .then(str => {
                const parser = new DOMParser();
                const xml = parser.parseFromString(str, "text/xml");
                // 'yourTagName'에 원하는 태그 이름을 입력하세요.
                const targetData = xml.querySelectorAll(tag);
                const arraydata = Array.from(targetData).map(targetData => targetData.textContent); // 각 'item'의 텍스트를 배열로 변환
                setData(arraydata);
                const Dataarray = setfooddata(arraydata)
                const refs = [breakref,lunchref,dinnerref];
          Dataarray.forEach((subArray, index) => {
                const currentRef = refs[index].current;
                if (currentRef) {
                  subArray.forEach((item) => {
                  const newParagraph = document.createElement("p");
                  newParagraph.innerText = item;
                  currentRef.appendChild(newParagraph);
                });
              }
            })
          })
            .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className="App">
      <BrowserView>
        데스크톱 브라우저!
        <div className="food_box" ref={breakref}></div>
        <div className="food_box" ref={lunchref}></div>
        <div className="food_box" ref={dinnerref}></div>
      </BrowserView>
      <MobileView>
        모바일 브라우저!
      </MobileView>
    </div>
  );
}

export default App;
