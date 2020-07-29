import React, { useState, useEffect } from "react";
import events from "./events";
import _ from "lodash";
import {
  Calendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import moment_timezone from "moment-timezone";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";

moment_timezone.tz.setDefault("Asia/Seoul");

const DragAndDropCalendar = withDragAndDrop(Calendar);

// -------------------------------------------------
function Event({ event }) {
  return (
    <span>
      <strong style={{color:"Coral"}}>{event.title}</strong>
    </span>
  )
}

//Agenda에서 이벤트 주는거
function EventAgenda({ event }) {
  return (
    <span>
      <em style={{ color: "magenta" }}>{event.title}</em>
      <p>{event.desc}</p>
    </span>
  );
}

//allday 이거 지웠고, 

function App() {
  const [Events, setEvents] = useState(_.cloneDeep(events));
  // const [Events, setEvents] = useState(events);
  const [dayLayoutAlgorithm, setdayLayoutAlgorithm] = useState("no-overlap");

  function handleSelect({ start, end }){
    const title = window.prompt("일정을 추가하세요");
    const desc = window.prompt("내용을 추가하세요");
    if (title) 
      setEvents(
        (events) => [
          ...events, 
          { 
            title,
            start,
            end,
            desc,
          }
      ]
    );
  };

//? : 이해하기
  function moveEvent({ event, start, end}){
    const nextEvents = Events.map((existingEvent) => {
      console.log(event.title)
      return existingEvent.title === event.title
        ? { ...existingEvent, start, end }
        : existingEvent;
    });
    setEvents(nextEvents)
  };


  function resizeEvent({ event, start, end}){
    const nextEvents = Events.map((existingEvent) => {
      return existingEvent.title === event.title
        ? { ...existingEvent, start, end }
        : existingEvent;
    });
    setEvents(nextEvents)
  };


  function onSelectEvent(pEvent) {
    const r = window.confirm("일정을 취소합니다.");
    if (r === true) {
      setEvents((preEvents) => {
        const events = [...preEvents];
        const idx = events.indexOf(pEvent);
        events.splice(idx, 1);
        return events;
      });
    }
  }

  
  const localizer = momentLocalizer(moment_timezone);
  return (
    <>
      <h1>일정관리</h1>
      <DragAndDropCalendar
        style={{ height: 800, width: "100%" }}
        popup={true}       //+ _x_ more"링크를 클릭하면 잘린 이벤트를 오버레이에 표시합니다.
        selectable={true}   //필수 ** 날짜와 범위를 선택할수 있게 만들어줌
        localizer={localizer} //moment 모듈을 이용한 로컬화
        events={Events} //이벤트 나오게 하는거
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.MONTH} //디폴트 뷰
        scrollToTime={new Date()} //**스크롤 시작 위치를 정해줌(안해줘도 될듯)
        defaultDate={moment_timezone().toDate()} //디폴트 날짜
        onSelectSlot={handleSelect} //**날짜 선택시 콜백이 발생한다 -> 위에서 만들어준 handleSelect가 실행
        dayLayoutAlgorithm={dayLayoutAlgorithm} //레이아웃 배열의 알고리즘
        onDragStart={console.log}              //콘솔로그 찍히는거 드래그 시작할 떄  

        
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        onDoubleClickEvent={(event) => onSelectEvent(event)}
        
        components={{
          event: Event, //여기서 호버줘야함
          agenda: {
            event: EventAgenda,
          },
          
        }}
      />
    </>
  );
}

export default App;
