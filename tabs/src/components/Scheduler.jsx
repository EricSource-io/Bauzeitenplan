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
  AddIcon,
} from "@fluentui/react-northstar";

export class ResourceList {
  constructor(list) {
    this.list = React.useState(list);
  }
  getColor(id) {
    const [state, setState] = this.list;
    let color = state.filter((e) => e.id === id)[0].color;
    return color;
  }
  updateItem(item) {
    //Item id cannot be changed !
    const [state, setState] = this.list;
    let list = state;
    let oldItem = list.find((e) => e.id === item.id);
    let index = list.indexOf(oldItem);
    list[index] = item;
    setState(list);
  }
  addItem(item) {
    const [state, setState] = this.list;
    let list = state;
    list.push(item);
    setState(list);
  }
}

ResourceList.Item = class {
  constructor(id, name, color) {
    this.id = id;
    this.name = name;
    this.color = color;
  }
};

export class Event {
  constructor(id, start, end, text) {
    this.id = id;
    this.state = React.useState({ start: start, end: end, text: text });
  }
  setStart(date) {
    const [state, setState] = this.state;
    setState({ start: date, end: state.end, text: state.text });
  }
  setEnd(date) {
    const [state, setState] = this.state;
    setState({ start: state.start, end: date, text: state.text });
  }
  setText(text) {
    const [state, setState] = this.state;
    setState({ start: state.start, end: state.end, text: text });
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
      addResource: React.useState(false),
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
      const [state, setState] = this.config.resources.list;
      const itemList = state.map((item, index) => {
        return (
          <div
            key={item.id}
            style={{
              position: "absolute",
              top: index * this.config.size.cell,
              width: "128px",
              border: "0px none",
            }}
            unselectable="on"
          >
            <div
              className="scheduler_resource"
              style={{ height: this.config.size.cell }}
            >
              <div className="scheduler_resource_inner">{item.name}</div>
              <div className="scheduler_resourcedivider" />
            </div>
          </div>
        );
      });
      return itemList;
    },
    Dialog: () => {
      const [stateResourceList, setStateResourceList] =
        this.config.resources.list;
      const [stateDialogResources, setStateDialogResources] =
        this.config.dialog.resources;
      const [stateDialogAddResource, setStateDialogAddResource] =
        this.config.dialog.addResource;
      const [stateAddResourceColor, setStateAddResourceColor] = React.useState(
        this.config.colors[0]
      );
      const [stateDialogEvent, setStateDialogEvent] = this.config.dialog.event;

      const [stateEventData, setEventData] = React.useState({
        name: `Event ${this.config.events.length + 1}`,
        resource: "",
        date: {
          start: new Date(),
          end: new Date(),
        },
      });

      function handleEventNameInput(event) {
        setEventData({
          name: event.target.value,
          resource: stateEventData.resource,
          date: {
            start: stateEventData.date.start,
            end: stateEventData.date.end,
          },
        });
      }

      let colorChange = (index) => {
        if (index === this.config.colors.length - 1) {
          index = 0;
        } else {
          index++;
        }
        return this.config.colors[index];
      };

      let ResourceItems = () => {
        const [state, setState] = this.config.resources.list;
        let itemList = state.map((item) => {
          const [colorState, setColorState] = React.useState(
            this.config.colors.find((e) => e.hex === item.color)
          );

          return (
            <div className="resource_item" key={item.id + "resource"}>
              <Flex gap="gap.medium">
                <FlexItem>
                  <Input
                    icon={<EditIcon />}
                    placeholder={item.name}
                    clearable
                    type="text"
                    fluid
                    onChange={(e) => {
                      let value = e.target.value;
                      if (value !== undefined) {
                        changedNames[item.id] = {
                          id: item.id,
                          value: value,
                        };
                      } else {
                        changedNames.splice(item.id, 1);
                      }
                    }}
                  />
                </FlexItem>
                <FlexItem>
                  <Button
                    circular
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
                      let color = colorChange(
                        this.config.colors.indexOf(colorState)
                      );
                      changedColors[item.id] = { id: item.id, color: color };
                      setColorState(color);
                    }}
                    content={colorState.name}
                    style={{ borderColor: colorState.hex, minWidth: 100 }}
                  />
                </FlexItem>
              </Flex>
            </div>
          );
        });
        return itemList;
      };

      function createEvent() {}

      let changedNames = [];
      let changedColors = [];

      let saveChangedData = () => {
        const [state, setState] = this.config.resources.list;
        changedNames.forEach((i) => {
          let item = state.find((e) => e.id === i.id);
          item.name = i.value;
          this.config.resources.updateItem(item);
        });

        changedColors.forEach((i) => {
          let item = state.find((e) => e.id === i.id);
          item.color = i.color.hex;
          this.config.resources.updateItem(item);
        });
      };

      let resourceDialogConfirm = () => {
        saveChangedData();
        //Close Dialog
        setStateDialogResources(false); /*SAVE Data*/
      };

      //Resource add dialog
      let inputResourceAdd = stateResourceList.length + 1;

      return (
        <>
          <Dialog
            closeOnOutsideClick={false}
            open={stateDialogEvent}
            id="dialog_event"
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
                      items={""}
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
              setStateDialogEvent(false); /*SAVE Data*/
            }}
            onCancel={() => setStateDialogEvent(false)}
          />

          <Dialog
            closeOnOutsideClick={false}
            open={stateDialogResources}
            id="dialog_resource"
            content={
              <>
                <h2 className="dialog_title">Gewerke verwalten</h2>
                <div className="dialog_content">
                  <Button
                    fluid
                    primary
                    content="Gewerk hinzufügen"
                    icon={<AddIcon />}
                    onClick={() => {
                      saveChangedData();
                      setStateDialogResources(false);
                      setStateDialogAddResource(true);
                    }}
                  />
                  <div id="dialog_resource_list">


                  <ResourceItems />
                  </div>
                </div>
              </>
            }
            confirmButton="Fertig"
            onConfirm={resourceDialogConfirm}
          />
          <Dialog
            closeOnOutsideClick={false}
            open={stateDialogAddResource}
            id="dialog_resource"
            content={
              <>
                <h2 className="dialog_title">Gewerke hinzufügen</h2>
                <div className="dialog_content">
                  <Flex gap="gap.medium">
                    <FlexItem>
                      <Input
                        icon={<EditIcon />}
                        clearable
                        placeholder={`Gewerk ${stateResourceList.length + 1}`}
                        onChange={(e) => {
                          let value = e.target.value;
                          if (value !== undefined) {
                            inputResourceAdd = value;
                          } else {
                            inputResourceAdd = stateResourceList.length + 1;
                          }
                        }}
                        type="text"
                        fluid
                      />
                    </FlexItem>
                    <FlexItem>
                      <Button
                        circular
                        icon={
                          <CallRecordingIcon
                            style={{
                              color: stateAddResourceColor.hex,
                              position: "absolute",
                              right: 15,
                            }}
                          />
                        }
                        iconPosition="after"
                        onClick={(e) => {
                          let color = colorChange(
                            this.config.colors.indexOf(stateAddResourceColor)
                          );
                          setStateAddResourceColor(color);
                        }}
                        content={stateAddResourceColor.name}
                        style={{
                          borderColor: stateAddResourceColor.hex,
                          minWidth: 100,
                        }}
                      />
                    </FlexItem>
                  </Flex>
                </div>
              </>
            }
            cancelButton="Abbrechen"
            confirmButton="Hinzufügen"
            onConfirm={() => {
              this.config.resources.addItem(
                new ResourceList.Item(
                  stateResourceList.length + 1,
                  inputResourceAdd,
                  stateAddResourceColor.hex
                )
              );
              setStateDialogAddResource(false);
              setStateDialogResources(true);
            }}
            onCancel={() => {
              setStateDialogAddResource(false);
              setStateDialogResources(true);
            }}
          />
        </>
      );
    },
    Cells: () => {
      const [state, setState] = this.config.resources.list;
      let itemList = [];
      for (
        let day = 0;
        day <=
        this.getDaysBetween(this.config.date.start, this.config.date.end);
        day++
      ) {
        for (let row = 0; row < state.length; row++) {
          itemList.push(
            <div
              key={`${row.toString()}_${day.toString()}`}
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
        const [state, setState] = event.state;
        let getLeftPositioning = () => {
          return (
            this.getDaysBetween(this.config.date.start, state.start) *
            this.config.size.cell
          );
        };
        return (
          <div
            className="scheduler_default_event"
            key={event.id + "event"}
            style={{
              backgroundColor: this.config.resources.getColor(event.id),
              width:
                this.getDaysBetween(state.start, state.end) *
                this.config.size.cell,
              left: getLeftPositioning(),
              top: event.id * this.config.size.cell,
              height: this.config.size.cell,
              lineHeight: this.config.size.cell + "px",
            }}
          >
            {state.text}
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
      const [state, setState] = this.config.resources.list;
      return (
        <>
          <this.HTML.Dialog />
          <div id="scheduler_main">
            <div
              id="scheduler_divider_vertical"
              style={{
                height: state.length * this.config.size.cell + 105,
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
                    top: state.length * this.config.size.cell,
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
              height: state.length * this.config.size.cell + 15,
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
