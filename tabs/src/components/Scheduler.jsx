/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React from "react";

import {
  Dialog,
  Input,
  Button,
  EditIcon,
  Flex,
  FlexItem,
  CallRecordingIcon,
  Segment,
  Dropdown,
} from "@fluentui/react-northstar";

export class Resource {
  constructor(id, name, color) {
    this.id = id;
    this.state = React.useState({ name: name, color: color });
  }
  setColor(color) {
    const [state, setState] = this.state;
    setState({ name: state.name, color: color });
  }
  setName(name) {
    const [state, setState] = this.state;
    setState({ name: name, color: state.color });
  }
}

export class Scheduler {
  config = {
    date: {
      start: new Date(),
      end: new Date(),
    },
    colors: [
      { name: "Blau", hex: "#7b83eb" },
      { name: "Grün", hex: "#8bc34a" },
      { name: "Rot", hex: "#f44336" },
      { name: "Gelb", hex: "#ff9800" },
    ],
    dialog: {
      resources: React.useState(false),
      event: React.useState(false),
    },
    size: {
      cell: 40,
    },
    resources: [],
    events: [],
  };
  ref = {
    scheduler_default_scrollable: React.createRef(),
    scheduler_default_timeheader_scroll: React.createRef(),
  };
  syncScroll() {
    var timeheader = document.getElementById(
      "scheduler_default_timeheader_scroll"
    );
    var defaultScroll = document.getElementById("scheduler_default_scrollable");
    timeheader.scrollLeft = defaultScroll.scrollLeft;
  }
  getDaysBetween(startDate, endDate) {
    var daysBetween = Math.floor(
      (Date.parse(endDate) - Date.parse(startDate)) / (24 * 60 * 60 * 1000)
    );
    return daysBetween;
  }
  getDaysInMonth(anyDateInMonth) {
    return new Date(
      anyDateInMonth.getFullYear(),
      anyDateInMonth.getMonth() + 1,
      0
    ).getDate();
  }

  HTML = {
    ResourceList: () => {
      const itemList = this.config.resources.map((resource) => {
        const [state, setState] = resource.state;
        return (
          <div
            key={resource.id}
            style={{
              position: "absolute",
              top: resource.id * this.config.size.cell,
              width: "128px",
              border: "0px none",
            }}
            unselectable="on"
          >
            <div
              className="scheduler_resource"
              style={{ height: this.config.size.cell }}
            >
              <div className="scheduler_resource_inner">{state.name}</div>
              <div className="scheduler_resourcedivider" />
            </div>
          </div>
        );
      });
      return itemList;
    },
    Dialog: () => {
      const [stateResources, setStateResources] = this.config.dialog.resources;
      const [stateEvent, setStateEvent] = this.config.dialog.event;
      let changedNames = [];
      let changedColors = [];

      const [stateEventData, setEventData] = React.useState({
        name: `Event ${this.config.events.length + 1}`,
        resource: "",
        date: {
          start: new Date(),
          end: new Date(),
        },
      });

      let createEvent = () => {};

      let handleEventNameInput = (event) => {
        setEventData({
          name: event.target.value,
          resource: stateEventData.resource,
          date: {
            start: stateEventData.date.start,
            end: stateEventData.date.end,
          },
        });
      };

      let ResourceItems = () => {
        let itemList = this.config.resources.map((resource) => {
          const [state, setState] = resource.state;
          const [colorState, setColorState] = React.useState(
            this.config.colors.find((e) => e.hex === state.color)
          );

          let colorChange = () => {
            let nextColor = () => {
              let index = this.config.colors.indexOf(colorState);
              if (index === this.config.colors.length - 1) {
                index = 0;
              } else {
                index++;
              }
              return this.config.colors[index];
            };
            let color = nextColor();
            changedColors[resource.id] = { id: resource.id, color: color };
            setColorState(color);
          };

          return (
            <div className="resource_item" key={resource.id + "resource"}>
              <Flex gap="gap.medium">
                <FlexItem>
                  <Input
                    icon={<EditIcon />}
                    placeholder={state.name}
                    clearable
                    type="text"
                    fluid
                    onChange={(e) => {
                      let value = e.target.value;
                      if (value !== undefined) {
                        changedNames[resource.id] = {
                          id: resource.id,
                          value: value,
                        };
                      } else {
                        changedNames.splice(resource.id, 1);
                      }
                    }}
                  />
                </FlexItem>
                <FlexItem>
                  <Button
                    icon={
                      <CallRecordingIcon
                        style={{
                          color: colorState.hex,
                          position: "absolute",
                          right: 15,
                        }}
                      />
                    }
                    iconPosition="after"
                    onClick={(e) => {
                      colorChange();
                    }}
                    content={colorState.name}
                    style={{ borderColor: colorState.hex, minWidth: 100 }}
                  ></Button>
                </FlexItem>
              </Flex>
            </div>
          );
        });
        return itemList;
      };
      return (
        <>
          <Dialog
            closeOnOutsideClick={false}
            open={stateEvent}
            id="dialog_resource"
            content={
              <>
                <h2 className="dialog_title">Event hinzufügen</h2>
                <div className="dialog_content">
                  <Flex column gap="gap.small">
                    <Input
                      label="Name:"
                      type="text"
                      value={stateEventData.name}
                      onChange={(e) => handleEventNameInput(e)}
                      fluid
                    />
                    <Dropdown
                      placeholder="Wähle ein Gewerk aus"
                      items={this.config.resources.map((res) => res.name)}
                      fluid
                    />
                    <Flex gap="gap.small">
                      <Input
                        type="date"
                        label="Von:"
                        //   value={stateEventData.date.start}
                        fluid
                      />
                      <Input
                        type="date"
                        label="Bis:"
                        // value={stateEventData.date.end}
                        fluid
                      />
                    </Flex>
                  </Flex>
                </div>
              </>
            }
            cancelButton="Abbrechen"
            confirmButton="Hinzufügen"
            onConfirm={() => {
              createEvent();
              setStateEvent(false); /*SAVE Data*/
            }}
            onCancel={() => setStateEvent(false)}
          />

          <Dialog
            closeOnOutsideClick={false}
            open={stateResources}
            id="dialog_resource"
            content={
              <>
                <h2 className="dialog_title">Ressourcen verwalten</h2>
                <div className="dialog_content">
                  <ResourceItems />
                </div>
              </>
            }
            confirmButton="Fertig"
            onConfirm={() => {
              //FIXME
              /* changedColors.indexOf(i) is -1  */
              // console.log(changedNames)
              changedNames.forEach((resource) => {
                this.config.resources
                  .find((e) => e.id === resource.id)
                  .setName(resource.value);
              });
              //FIXME

              changedColors.forEach((resource) => {
                this.config.resources
                  .find((e) => e.id === resource.id)
                  .setColor(resource.color.hex);
              });
              //Close Dialog
              setStateResources(false); /*SAVE Data*/
            }}
          />
        </>
      );
    },
    Cells: () => {
      let itemList = [];
      for (
        let day = 0;
        day <=
        this.getDaysBetween(this.config.date.start, this.config.date.end);
        day++
      ) {
        for (let row = 0; row < this.config.resources.length; row++) {
          itemList.push(
            <div
              key={day.toString() + row.toString()}
              className="scheduler_cell"
              style={{
                top: row * this.config.size.cell,
                left: day * this.config.size.cell,
                height: this.config.size.cell,
                width: this.config.size.cell,
              }}
            />
          );
        }
      }
      return itemList;
    },
    Events: () => {
      let itemList = this.config.events.map((event) => {
        let getLeftPositioning = () => {
          return (
            this.getDaysBetween(this.config.date.start, event.start) *
            this.config.size.cell
          );
        };
        return (
          <div
            className="scheduler_default_event"
            key={event.id + "event"}
            style={{
              backgroundColor: this.config.resources.find(
                (resource) => resource.id === event.id
              ).state[0].color,
              width:
                this.getDaysBetween(event.start, event.end) *
                this.config.size.cell,
              left: getLeftPositioning(),
              top: event.id * this.config.size.cell,
              height: this.config.size.cell,
              lineHeight: this.config.size.cell + "px",
            }}
          >
            {event.text}
          </div>
        );
      });
      return itemList;
    },
    Timeheader_Month: () => {
      let startDate = this.config.date.start;
      let endDate = this.config.date.end;
      const daysBetween = this.getDaysBetween(
        this.config.date.start,
        this.config.date.end
      );
      let currentDate = new Date(this.config.date.start);

      let offsetX = 0;
      let getLeftPositioning = () => {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const isStartEqualCurrentDate =
          startDate.getMonth() === currentMonth &&
          startDate.getFullYear() === currentYear;
        offsetX += getUsedDaysOfMonth() * this.config.size.cell;
        if (isStartEqualCurrentDate) {
          return 0;
        }
        return offsetX - getUsedDaysOfMonth() * this.config.size.cell;
      };

      let getUsedDaysOfMonth = () => {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const isStartEqualCurrentDate =
          startDate.getMonth() === currentMonth &&
          startDate.getFullYear() === currentYear;
        const isEndEqualCurrentDate =
          endDate.getMonth() === currentMonth &&
          endDate.getFullYear() === currentYear;

        if (isStartEqualCurrentDate || isEndEqualCurrentDate) {
          if (isStartEqualCurrentDate && isEndEqualCurrentDate) {
            return this.getDaysBetween(startDate, endDate) + 1;
          } else if (isStartEqualCurrentDate) {
            let date = new Date(startDate);
            date.setMonth(date.getMonth() + 1);
            date.setDate(1);
            return this.getDaysBetween(startDate, date);
          } else {
            let date = new Date(endDate);
            date.setDate(1);
            return this.getDaysBetween(date, endDate) + 1;
          }
        } else {
          return this.getDaysInMonth(currentDate);
        }
      };

      let itemList = [];
      let monthCache = null;
      for (let day = 0; day <= daysBetween; day++) {
        if (monthCache !== currentDate.getMonth()) {
          monthCache = currentDate.getMonth();

          itemList.push(
            <div
              key={currentDate}
              className="scheduler_timeheader_month"
              style={{
                width: getUsedDaysOfMonth() * this.config.size.cell,
                left: getLeftPositioning(),
                userSelect: "none",
              }}
            >
              {currentDate.toLocaleString("de-DE", { month: "long" })}{" "}
              {currentDate.getFullYear()}
            </div>
          );
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return itemList;
    },
    Timeheader_Week: () => {
      let endDate = this.config.date.end;

      const daysBetween = this.getDaysBetween(
        this.config.date.start,
        this.config.date.end
      );

      let currentDate = new Date(this.config.date.start);
      let offsetX = 0;

      let getWeekNumber = (date) => {
        var month = date.getMonth() + 1; // use 1-12
        var year = date.getFullYear();
        var day = date.getDate();
        var a = Math.floor((14 - month) / 12);
        var y = year + 4800 - a;
        var m = month + 12 * a - 3;
        var jd =
          day +
          Math.floor((153 * m + 2) / 5) +
          365 * y +
          Math.floor(y / 4) -
          Math.floor(y / 100) +
          Math.floor(y / 400) -
          32045; // (gregorian calendar)

        //calc weeknumber
        var d4 = (((jd + 31741 - (jd % 7)) % 146097) % 36524) % 1461;
        var L = Math.floor(d4 / 1460);
        var d1 = ((d4 - L) % 365) + L;
        var NumberOfWeek = Math.floor(d1 / 7) + 1;
        return NumberOfWeek;
      };
      let getLeftPositioning = () => {
        const weekNumber = getWeekNumber(currentDate);
        const usedDays = getUsedDaysOfWeek(weekNumber);
        offsetX += usedDays * this.config.size.cell;
        return offsetX - usedDays * this.config.size.cell;
      };

      let getUsedDaysOfWeek = (weekNumber) => {
        let days = 0;
        const date = new Date(currentDate);
        const lastDay = new Date(endDate);
        lastDay.setDate(lastDay.getDate() + 1);
        while (
          weekNumber === getWeekNumber(date) &&
          date.toString() !== lastDay.toString()
        ) {
          date.setDate(date.getDate() + 1);
          days++;
        }
        return days;
      };

      let itemList = [];
      let weekCache = null;

      for (let day = 0; day <= daysBetween; day++) {
        const weekNumber = getWeekNumber(currentDate);
        if (weekCache !== weekNumber) {
          let width = getUsedDaysOfWeek(weekNumber) * this.config.size.cell;
          weekCache = weekNumber;
          itemList.push(
            <div
              key={weekNumber.toString() + currentDate.toDateString()}
              className="scheduler_timeheader_week"
              style={{
                width: width,
                left: getLeftPositioning(),
                userSelect: "none",
              }}
            >
              KW{weekNumber}
            </div>
          );
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return itemList;
    },
    Timeheader_Day: () => {
      let itemList = [];
      let currentDate = new Date(this.config.date.start);
      const daysBetween = this.getDaysBetween(
        this.config.date.start,
        this.config.date.end
      );
      for (let day = 0; day <= daysBetween; day++) {
        itemList.push(
          <div
            key={day}
            className="scheduler_timeheader_day"
            style={{
              left: day * this.config.size.cell,
              userSelect: "none",
              width: this.config.size.cell,
            }}
          >
            {currentDate.getDate()}
          </div>
        );
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return itemList;
    },
    Scheduler: () => {
      return (
        <>
          <this.HTML.Dialog />
          <div id="scheduler_main">
            <div
              id="scheduler_divider_vertical"
              style={{
                height:
                  this.config.resources.length * this.config.size.cell + 105,
              }}
            />
            <div id="scheduler_divider_horizontal" />

            <div id="scheduler_sidebar">
              <div id="scheduler_corner">
                <h3 id="scheduler_corner_inner">Gewerke</h3>
              </div>

              <div id="scheduler_resource_table">
                <this.HTML.ResourceList />

                <div
                  id="scheduler_default_rowEnd"
                  style={{
                    top: this.config.resources.length * this.config.size.cell,
                  }}
                />
              </div>
            </div>
          </div>
          <div
            id="scheduler_default_timeheader_scroll"
            ref={this.ref.scheduler_default_timeheader_scroll}
          >
            <this.HTML.Timeheader_Month />
            <this.HTML.Timeheader_Week />
            <this.HTML.Timeheader_Day />
          </div>
          <div
            id="scheduler_default_scrollable"
            ref={this.ref.scheduler_default_scrollable}
            onScroll={this.syncScroll}
            style={{
              height: this.config.resources.length * this.config.size.cell + 15,
            }}
          >
            <this.HTML.Cells />
            <this.HTML.Events />
          </div>
          <div style={{ position: "absolute", top: "-10px", left: "200px" }}>
            <p>
              START:{" "}
              {this.config.date.start.getDate() +
                ". " +
                (this.config.date.start.getMonth() + 1) +
                " " +
                this.config.date.start.getFullYear()}
            </p>
            <p>
              ENDE:{" "}
              {this.config.date.end.getDate() +
                ". " +
                (this.config.date.end.getMonth() + 1) +
                " " +
                this.config.date.end.getFullYear()}
            </p>
          </div>
        </>
      );
    },
  };
}
