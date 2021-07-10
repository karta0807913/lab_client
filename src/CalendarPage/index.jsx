import React from "react";

export default class CalendarPage extends React.Component {
  render() {
    return (
      <iframe
        src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=1&amp;bgcolor=%23ffffff&amp;ctz=Asia%2FTaipei&amp;src=NzlsZm5sZjJwamprcDByZzB1dXIyMnVxdDhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&amp;color=%237986CB&amp;showTitle=0&amp;showNav=1&amp;showPrint=0&amp;showTabs=1&amp;showCalendars=0"
        height="100%"
        frameBorder="0"
        scrolling="no">
      </iframe>
    );
  }
}