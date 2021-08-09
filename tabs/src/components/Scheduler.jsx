/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React from "react";
import {
  Button,
  Input,
  Dropdown,
  Flex,
  MenuButton,
  Menu,
  ThumbtackSlashIcon,
  addDays,
} from "@fluentui/react-northstar";

export default class Scheduler {
  config = {
    date: {
      start: new Date(),
      end: new Date(),
    },
    size: {
      cell: 40,
    },
    days: 365,
    resources: [],
    events: [],
    months: [
      {
        name: "Januar",
        days: 31,
      },
      {
        name: "Februar",
        days: 28,
      },
      {
        name: "März",
        days: 31,
      },
      {
        name: "April",
        days: 30,
      },
      {
        name: "Mai",
        days: 31,
      },
      {
        name: "Juni",
        days: 30,
      },
      {
        name: "Juli",
        days: 31,
      },
      {
        name: "August",
        days: 31,
      },
      {
        name: "September",
        days: 30,
      },
      {
        name: "Oktober",
        days: 31,
      },
      {
        name: "November",
        days: 30,
      },
      {
        name: "Dezember",
        days: 31,
      },
    ],
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

  update() {}

  getDaysBetween(startDate, endDate) {
    var daysBetween = Math.floor(
      (Date.parse(endDate) - Date.parse(startDate)) / 86400000
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
  getDaysOf;
  HTML = {
    ResourceList: () => {
      const itemList = this.config.resources.map((resource) => (
        <div
          key={resource.id}
          style={{
            position: "absolute",
            top: (resource.id - 1) * this.config.size.cell + "px",
            width: "128px",
            border: "0px none",
          }}
          unselectable="on"
        >
          <div className="scheduler_resource">
            <div className="scheduler_resource_inner">{resource.name}</div>
            <div className="scheduler_resourcedivider" />
          </div>
        </div>
      ));
      return itemList;
    },
    Dialog: () => {
      return (
        <div id="dialog">
          <div id="dialogBackgroundShader"></div>
          <div id="dialogBody">
            <p id="dialogTitle">Erstelle ein neues Event:</p>
            <Input fluid placeholder="Event 1" id="inputEvent" />
            <Dropdown
              fluid
              style={{ marginTop: "10px" }}
              items={this.config}
              id="resourceEvent"
            />
            <Flex gap="gap.smaller" style={{ marginTop: "7px" }}>
              <Input fluid type="date" label="Start:" />
              <Input fluid type="date" label="Ende:" id="dateEndEvent" />
            </Flex>
            <Button primary content="Erstellen" id="addBtnEvent"></Button>
            <Button content="Abbrechen" id="closeBtnEvent"></Button>
          </div>
        </div>
      );
    },
    Cells: () => {
      let itemList = [];
      for (
        var day = 0;
        day < this.getDaysBetween(this.config.date.start, this.config.date.end);
        day++
      ) {
        for (var row = 0; row < this.config.resources.length; row++) {
          itemList.push(
            <div
              key={day.toString() + row.toString()}
              className="scheduler_cell"
              style={{
                top: (row * this.config.size.cell).toString() + "px",
                left: (day * this.config.size.cell).toString() + "px",
              }}
            />
          );
        }
      }
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
        console.log(getUsedDaysOfMonth());
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
            return this.getDaysBetween(startDate, endDate);
          } else if (isStartEqualCurrentDate) {
            let date = new Date(startDate);
            date.setMonth(date.getMonth() + 1);
            date.setDate(1);
            return this.getDaysBetween(startDate, date);
          } else {
            let date = new Date(endDate);
            date.setDate(1);
            return this.getDaysBetween(date, endDate);
          }
        } else {
          return this.getDaysInMonth(currentDate);
        }
      };

      let itemList = [];
      let monthCache = null;
      for (var day = 0; day < daysBetween; day++) {
        currentDate.setDate(currentDate.getDate() + 1);

        if (monthCache !== currentDate.getMonth()) {
          monthCache = currentDate.getMonth();

          itemList.push(
            <div
              key={currentDate}
              className="scheduler_timeheader_month"
              style={{
                width:
                  (getUsedDaysOfMonth() * this.config.size.cell).toString() +
                  "px",
                left: getLeftPositioning().toString() + "px",
                userSelect: "none",
              }}
            >
              {currentDate.toLocaleString("de-DE", { month: "long" })} {currentDate.getFullYear()}
            </div>
          );
        }
      }
      return itemList;
    },
    Timeheader_Week: () => {
      let days = 7;
      let dayOffset = 0;
      var getLeftPositioning = (week) => {
        var weekIndex = week * days * this.config.size.cell;
        weekIndex = week !== 0 ? weekIndex + dayOffset : weekIndex;
        return weekIndex;
      };
      var getWeekNumber = (currentdate) => {
        var oneJan = new Date(currentdate.getFullYear(), 0, 1);
        var numberOfDays = Math.floor(
          (currentdate - oneJan) / (24 * 60 * 60 * 1000)
        );
        var result = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);
        console.log(result, "week number")
      };
      let itemList = [];
      // A year has 53 weeks
      let year = this.config.date.start.getFullYear();

      //TESCHT
      getWeekNumber(new Date(year, 0, 1));
      getWeekNumber(new Date(year, 1, 1));
      getWeekNumber(new Date(year, 11, 1));
      //TESCHT


      for (let week = 0; week < 53; week++) {
        let weekDays = 7;
        if (week === 0) {
          let date = new Date(year, 0, 0);
          let day = date.getDay();
          weekDays = days - day;
          dayOffset = -day * this.config.size.cell;
        } else if (week === 52) {
          let date = new Date(year, 0, 0);
          let day = date.getDay();
          weekDays = 1 + days - (days - day);
        }
        itemList.push(
          <div
            key={week.toString() + "2021"}
            className="scheduler_timeheader_week"
            style={{
              width: weekDays * this.config.size.cell + "px",
              left: getLeftPositioning(week, year).toString() + "px",
              userSelect: "none",
            }}
          >
            KW{week !== 0 ? week : 53}{" "}
          </div>
        );
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
      for (var day = 0; day < daysBetween; day++) {
        itemList.push(
          <div
            key={day}
            className="scheduler_timeheader_day"
            style={{
              left: (day * this.config.size.cell).toString() + "px",
              userSelect: "none",
            }}
          >
            {currentDate.getDate()}{" "}
          </div>
        );
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return itemList;
    },
    Scheduler: () => {
      return (
        <div>
          <this.HTML.Dialog />
          <div id="scheduler_main" style={{ height: "388px" }}>
            <div
              id="scheduler_divider_vertical"
              style={{
                height:
                  (
                    this.config.resources.length * this.config.size.cell +
                    105
                  ).toString() + "px",
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
                    top:
                      (
                        this.config.resources.length * this.config.size.cell
                      ).toString() + "px",
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
              height:
                (
                  this.config.resources.length * this.config.size.cell +
                  15
                ).toString() + "px",
            }}
          >
            <this.HTML.Cells />
          </div>
        </div>
      );
    },
  };
}
