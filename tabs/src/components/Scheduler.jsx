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

  update() {}

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
        day <=
        this.getDaysBetween(this.config.date.start, this.config.date.end);
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
            return this.getDaysBetween(date, endDate) + 1;
          }
        } else {
          return this.getDaysInMonth(currentDate);
        }
      };

      let itemList = [];
      let monthCache = null;
      for (var day = 0; day <= daysBetween; day++) {
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
      let startDate = this.config.date.start;
      let endDate = this.config.date.end;

      const daysBetween = this.getDaysBetween(
        this.config.date.start,
        this.config.date.end
      );

      let currentDate = new Date(this.config.date.start);
      let offsetX = 0;

      let getLeftPositioning = () => {
        offsetX += 7 * this.config.size.cell;

        return offsetX - 7 * this.config.size.cell;
      };

      let getWeekNumber = () => {
        var month = currentDate.getMonth() + 1; // use 1-12
        var year = currentDate.getFullYear();
        var day = currentDate.getDate();
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

      let itemList = [];
      let weekCache = null;

      for (var day = 0; day <= daysBetween; day++) {
        const weekNumber = getWeekNumber();

        console.log(weekNumber, "=", day);
        if (weekCache !== weekNumber) {
          weekCache = weekNumber;

          let width = 7; //get the amount of days inside a specific

          itemList.push(
            <div
              key={weekNumber.toString() + currentDate.toDateString()}
              className="scheduler_timeheader_week"
              style={{
                width: width * this.config.size.cell + "px",
                left: getLeftPositioning().toString() + "px",
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
      for (var day = 0; day <= daysBetween; day++) {
        itemList.push(
          <div
            key={day}
            className="scheduler_timeheader_day"
            style={{
              left: (day * this.config.size.cell).toString() + "px",
              userSelect: "none",
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
