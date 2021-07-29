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
    size: {
      cell: 40
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
              onChange={(event, data) => console.log(data.value)}
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
      for (var day = 0; day < this.config.days; day++) {
        for (var row = 0; row < this.config.resources.length; row++) {
          itemList.push(
            <div
              key={day.toString() + row.toString()}
              className="scheduler_cell"
              style={{
                top: (row * this.config.size.cell ).toString() + "px",
                left: (day * this.config.size.cell ).toString() + "px",
              }}
            />
          );
        }
      }
      return itemList;
    },
    Timeheader_Month: () => {
      let itemList = this.config.months.map((month) => (
        <div
          style={{
            width: (month.days * this.config.size.cell ).toString() + "px",
          }}
        >
          {month.name}
        </div>
      ));
      return itemList;
    },
    Timeheader_Day: () => {
      let itemList = [];
      let current = {
        day: 0,
        month: 0,
        year: 0,
      };

      for (var day = 0; day < this.config.days; day++) {
        let month = this.config.months[current.month];
        console.log(current);
        current.day++;
        if (current.day > month.days) {
          current.month++;
          current.day = 1;
        }

        itemList.push(
          <div
            key={day}
            className="scheduler_timeheader_day"
            style={{
              left: (day * this.config.size.cell ).toString() + "px",
            }}
          >
            {current.day}
          </div>
        );
      }
      return itemList;
    },
    Scheduler: () => {
      return (
        <div>
          <this.HTML.Dialog />
          <div
            id="scheduler_main"
            style={{
              height: "388px",
            }}
          >
            <div
              id="scheduler_divider_vertical"
              style={{
                height:
                  (this.config.resources.length * this.config.size.cell  + 110).toString() + "px",
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
                    top: (this.config.resources.length * this.config.size.cell ).toString() + "px",
                  }}
                />
              </div>
            </div>
          </div>
          <div
            id="scheduler_default_timeheader_scroll"
            ref={this.ref.scheduler_default_timeheader_scroll}
          >
            <this.HTML.Timeheader_Day />
          </div>
          <div
            id="scheduler_default_scrollable"
            ref={this.ref.scheduler_default_scrollable}
            onScroll={this.syncScroll}
            style={{
              height:
                (this.config.resources.length * this.config.size.cell  + 20).toString() + "px",
            }}
          >
            <div className="scheduler_matrix_horizontal_line"></div>

            <this.HTML.Cells />
          </div>
        </div>
      );
    },
  };
}
