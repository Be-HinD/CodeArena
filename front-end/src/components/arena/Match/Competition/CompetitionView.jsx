import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import * as StompJs from '@stomp/stompjs';
import C_DividingLine from "./C_dividingLine";
import CompTopInfo from "./CompTopInfo";
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useSelector } from "react-redux";

export default function CompetitionView() {
  const params = useParams()
  const [chatList, setChatList] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentStompClient, setStompClient] = useState(null);
  const recentMessage = useRef(null);

  // const type = useRef();
  const sender = useRef(useSelector(state => state.auth.userNickname));
  // const message = useRef('');
  // const gameId = useRef(useSelector(state => state.arena.gameId))
  // const navigate = useNavigate();
  useEffect(() => {
    // if (gameId.current === null) {
    //   navigate('/notfound')
    // }
    const socket = new SockJS('https://i10d211.p.ssafy.io/game/ws-stomp');
    const stompClient = Stomp.over(socket);
    console.log("useEffect stompClient :", stompClient)

    stompClient.connect({}, () => {
      // 연결
      console.log('채팅과 연결이 되었어요 !')
      // 구독하기
      stompClient.subscribe('/sub/chat/room/'+`${params.id}`, (message) => {
        // 받은 메시지에 대한 처리
        console.log('채팅을 받았어요:', message);
        const msg = JSON.parse(message.body)
        const tmp = chatList
        const obj = {sender:msg.sender, message:msg.message}
        tmp.push(obj)
        setChatList(tmp)
        // setChatList((prevChatList) => [...prevChatList, message.body]);
        scrollToBottom();
      });
    }, error => {
      // 에러
      console.error("채팅 연결 에러났음", error)
    });

    setStompClient(stompClient)

    return () => {
      console.log("연결 끊었어요!!")
      stompClient.disconnect();
    }
  }, [params.id, chatList]);

  
  // 메세지 보내기 조작할 함수
  const handleSendMessage = (event) => {
    event.preventDefault() // 새로고침 방지
    // console.log("여긴 stompClient", currentStompClient)
    // console.log("여긴 inputMessage :", inputMessage.trim())
    if (currentStompClient && inputMessage.trim() !== '') {
      console.log("메시지 보냈어요")
      console.log("게임 아이디 찍음 :", params.id)
      currentStompClient.send(`/pub/chat/message`, {}, JSON.stringify({
        gameId: params.id,
        sender: sender.current,
        message: inputMessage,
        type: 'TALK',
      }));
      
      // const tmp = chatList
      // const obj = {
      //   sender : sender.current,
      //   message : inputMessage
      // }
      // console.log("여기 temp요!!",tmp)
      // tmp.push(obj)
      // setChatList(tmp)
      // console.log(inputMessage);
      setInputMessage('');
    }
  };

  // 메시지 input 작동
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  // 왼쪽과 오른쪽 패널의 너비를 나타내는 상태 -> 처음 렌더링 되었을 때 6:4 비율 
  const [panelWidths, setPanelWidths] = useState({
      left: 60,
      right: 40,
  });

  // 구분선 이동에 따른 왼쪽과 오른쪽 패널 비율 조정
  const handleDividerMove = (newPosition) => {
      const leftPanelWidth = newPosition;
      const rightPanelWidth = 100 - newPosition;

      // 비율 유지를 위해 스타일에 적용
      setPanelWidths({ left: leftPanelWidth, right: rightPanelWidth });
  };

  const scrollToBottom = () => {
    console.log("최신 메세지 들어옴 -> 스크롤 내려가유~")
    recentMessage.current?.scrollIntoView({ behavior: 'smooth'});
  }

  useEffect(() => {
    scrollToBottom();
  },[chatList.length])

  return (
    <div>
      <CompTopInfo />
      <div className="competition-view">
        {/* 왼쪽(6)에 해당하는 부분 */}
        <div className="left-panel ml-3 mr-3 mt-1" style={{ width: `${panelWidths.left}%`}}>
          <div
            className="user-screens mt-5 rounded-xl shadow-lg flex items-center justify-center"
            style={{ width: '100%', height: '90%', backgroundColor: '#F5EBDB' }}
          >
            {/* "유저1의 화면이 보이는 공간 vs 유저2의 화면이 보이는 공간" */}
            {/* 각 유저의 화면 구성 (추가적인 스타일 및 컨텐츠 추가 필요) */}
            <div className="user-screen">유저1의 화면</div>
            <div className="user-screen">vs</div>
            <div className="user-screen">유저2의 화면</div>
          </div>
        </div>

        {/* 구분선을 기준으로 왼쪽(6):오른쪽(4)로 나누어져있음 */}
        {/* handleDividerMove를 통해 왼쪽 오른쪽 화면 비율 조정 */}
        <C_DividingLine onDividerMove={handleDividerMove} />

        {/* 오른쪽(4)에 해당하는 부분 */}
        <div className="right-panel mr-3 mt-10 relative" style={{ width: `${panelWidths.right}%`, display: 'flex', flexDirection: 'column' }}>
          {/* 채팅 div */}
          <div className="ml-5 flex-grow" style={{ maxHeight: "80%", overflowY: "auto" }}>
            {/* 채팅창 */}
            <div className="chat-list mt-10">
              {chatList.map((message, index) => (
                <div
                  key={index}
                  ref={recentMessage}
                  className="chat chat-start flex"
                >
                  <div className="chat-bubble">
                  <strong>{message.sender}님 : </strong>
                  <span>{message.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* 입력 폼 */}
          <div className="flex justify-center items-center mt-5">
            <div className="w-full">
              <div className="flex justify-center items-center">
                <form onSubmit={handleSendMessage} className="flex">
                  <input
                    type="text"
                    className="rounded-full border-2 border-gray-300 px-4 py-2 flex-grow focus:outline-none focus:border-blue-400"
                    placeholder=" 메시지를 입력하세요...!"
                    value={inputMessage}
                    onChange={handleInputChange}
                    style={{ width: '400px' }}
                  />
                  <button
                    type="submit"
                    className="bg-blue-300 text-white rounded-full px-4 py-2 ml-2 focus:outline-none"
                  >
                    입력
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
} 