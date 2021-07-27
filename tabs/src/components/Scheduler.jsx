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
} from "@fluentui/react-northstar";

export default class Scheduler {
  config = {
    days: 365,
    resources: [],
    events: [],
  };
  months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];

  update() {}

  HTML = {
    ResourceList: () => {
      const itemList = this.config.resources.map((resource) => (
        <div
          key={resource.id}
          style={{
            position: "absolute",
            //40 column height
            top: (resource.id - 1) * 40 + "px",
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
                top: (row * 40).toString() + "px",
                left: (day * 40).toString() + "px",
              }}
            />
          );
        }
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
            <div id="scheduler_divider_vertical" style={{
              height: ((this.config.resources.length * 40) + 110).toString() + "px"
            }}/>
            <div id="scheduler_divider_horizontal" />

            <div id="scheduler_sidebar">
              <div id="scheduler_corner">
                <h3 id="scheduler_corner_inner">Gewerke</h3>
              </div>

              <div id="scheduler_resource_table">
                <this.HTML.ResourceList />

                <div id="scheduler_default_rowEnd" style={{top: ((this.config.resources.length * 40)).toString() + "px"}}/>
                
              </div>
            </div>
            <div style={{ width: "18140px", height: "90px" }}>
              <div style={{ position: "relative" }}>
                <div
                  className="scheduler_timeheadergroup"
                  style={{ left: "0px" }}
                >
                  <div className="scheduler_timeheadergroup_inner" />
                  <div
                    unselectable="on"
                    className="scheduler_timeheader_float"
                    style={{
                      position: "absolute",
                      inset: "0px 0px 0px 0px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="scheduler_timeheader_float_inner"
                      unselectable="on"
                    >
                      November 2022
                    </div>
                  </div>
                </div>
                <div
                  className="scheduler_timeheadergroup"
                  style={{ left: "1080px" }}
                >
                  <div className="scheduler_timeheadergroup_inner" />
                  <div
                    unselectable="on"
                    className="scheduler_timeheader_float"
                    style={{
                      position: "absolute",
                      inset: "0px 0px 0px 0px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="scheduler_timeheader_float_inner"
                      unselectable="on"
                    >
                      Dezember 2022
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

            <div
              className="scheduler_default_scrollable"
              style={{
                height: ((this.config.resources.length * 40) + 20).toString() + "px",
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
