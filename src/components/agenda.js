/* global gapi */
import React, { Component } from "react";
import moment from "moment";
import welcomeImage from "../images/welcome.svg";
import { GOOGLE_API_KEY, CALENDAR_ID } from "../config.js";


export default class Agenda extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: moment().format("dd, D MMMM, h:mm A"),
      events: [],
      isBusy: false,
      isEmpty: false,
      isLoading: true
    };
  }

  componentDidMount() {
    this.getEvents();
    setInterval(() => {
      this.tick();
    }, 1000);
    setInterval(() => {
      this.getEvents();
    }, 60000);
  };

  getEvents() {
    let that = this;
    function start() {
      gapi.client
        .init({
          apiKey: GOOGLE_API_KEY
        })
        .then(function() {
          return gapi.client.request({
            path: `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?maxResults=11&orderBy=updated&timeMin=${moment().toISOString()}&timeMax=${moment()
              .endOf("month")
              .toISOString()}`
          });
        })
        .then(
          response => {
            let events = response.result.items;
            let sortedEvents = events.sort(function(a, b) {
              return (
                moment(b.start.dateTime).format("DDMMYYYY") -
                moment(a.start.dateTime).format("DDMMYYYY")
              );
            });
            if (events.length > 0) {
              that.setState(
                {
                  events: sortedEvents,
                  isLoading: false,
                  isEmpty: false
                },
                () => {
                  that.setStatus();
                }
              );
            } else {
              that.setState({
                isBusy: false,
                isEmpty: true,
                isLoading: false
              });
            }
          },
          function(reason) {
            console.log(reason);
          }
        );
    }
    gapi.load("client", start);
  }

  tick() {
    let time = moment().format("dddd, D MMMM, h:mm A");
    this.setState({
      time: time
    });
  };

  setStatus() {
    let now = moment();
    let events = this.state.events;
    for (var e = 0; e < events.length; e++) {
      var eventItem = events[e];
      if (
        moment(now).isBetween(
          moment(eventItem.start.dateTime),
          moment(eventItem.end.dateTime)
        )
      ) {
        this.setState({
          isBusy: true,
        });
        return false;
      } else {
        this.setState({
          isBusy: false
        });
      }
    }
  };

  render() {
    const { time, events } = this.state;

    const eventsList = events.map((event) => {
      return (
        <a
          className="list-group-item"
          href={event.htmlLink}
          target="_blank"
          key={event.id}
        >
          {event.summary}{" "}
          <span className="badge">
            {moment(event.start.dateTime).format("h:mm a")},{" "}
            {moment(event.end.dateTime).diff(
              moment(event.start.dateTime),
              "minutes"
            )}{" "}
            minutes, {moment(event.start.dateTime).format("MMMM D")}{" "}
          </span>
        </a>
      );
    });

    let emptyState = (
      <div className="empty">
        <img src={welcomeImage} alt="Welcome" />
        <h3>
          Sem compromissos
        </h3>
      </div>
    );

    

    return (
      <div>
        <div className="current-time">{time}, 2018</div>
        <div className={ this.state.isBusy ? "current-status busy" : "current-status open" }>
          <h2>{this.state.isBusy ? "OCUPADO" : "LIVRE"}</h2>
        </div>
        <div className="upcoming-meetings">
          <h1>Próximas Consultas</h1>
          <div className="list-group">
            {events.length > 0 && eventsList}
            {this.state.isEmpty && emptyState}
          </div>
          <a className="primary-cta"
            href="https://calendar.google.com/calendar?cid=cTEzYm9hbGc4YWMzMzRxczV2cnZvMGNzNDBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ"
            target="_blank" 
            rel="noopener noreferrer">
            +
          </a>
        </div>
      </div>
    );
  }
}
