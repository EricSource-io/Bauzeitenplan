/* eslint-disable no-unused-vars */
import React from "react";
import {
  Button,
  Input,
  Dropdown,
  Flex,
  MenuButton,
  Menu,
} from "@fluentui/react-northstar";
import {
  AddIcon,
  SettingsIcon,
  MenuIcon,
} from "@fluentui/react-icons-northstar";
import "./Scheduler.css";
import { Scheduler, ResourceList, EventList } from "./Scheduler.jsx";
import { Firemain } from "../Firemain";
var firemain = new Firemain("test");
export var scheduler;
export default function Tab() {
  var dialogEvent = {
    inputEvent: document.getElementById("inputEvent"),
    resourceEvent: document.getElementById("resourceEvent"),
  };
  
  scheduler = new Scheduler();

  scheduler.config.date = {
    start: new Date(2021, 0, 1),
    end: new Date(2021, 1, 14),
  };
  scheduler.config.resources = new ResourceList([
    new ResourceList.Item(0, "Rückbau", "#ff9800"),
     new ResourceList.Item(1, "Putzarbeiten", "#7b83eb"),
     new ResourceList.Item(2, "Trockenbau", "#7b83eb"),
     new ResourceList.Item(3, "Estrich Bad/Küche", "#8bc34a"),
     new ResourceList.Item(4, "Sanitär Rückbau", "#7b83eb"),
     new ResourceList.Item(5, "Fliesenleger", "#7b83eb"),
     new ResourceList.Item(6, "Feinreinigung", "#7b83eb"),
     new ResourceList.Item(8, "Elektriker", "#7b83eb"),
   ]);
   scheduler.config.events = new EventList([
     new EventList.Item(0, 0, "2021-01-01", "2021-01-04", "Rückbau"),
     new EventList.Item(1, 3, "2021-01-05", "2021-01-15", "Trocknen"),
     new EventList.Item(2, 4, "2021-01-16", "2021-01-19", "Bodenfliesen"),
     new EventList.Item(3, 8, "2021-01-03", "2021-01-09", "Elektrik"),
    ]);
  const [state, setState] = scheduler.state;
  return (
    <>
      <div id="buttonHeader">
        <MenuButton
          trigger={<Button icon={<MenuIcon />} />}
          menu={[
            "Drucken",
            {
              content: "Speichern als",
              menu: {
                items: ["PDF", "JPG", "PNG"],
              },
            },
          ]}
          on="click"
        />
        <Button
          icon={<SettingsIcon />}
          primary
          content="Gewerke verwalten"
          className="ctrButton"
          onClick={() => setState(scheduler.getStateDialogObject(state, { resources: true }))}
        ></Button>
        <Button
          icon={<AddIcon />}
          primary
          content="Event"
          className="ctrButton"
          style={{ marginRight: "10px" }}
          onClick={() => setState(scheduler.getStateDialogObject(state, { event: true }))}
        ></Button>
      </div>
      <scheduler.HTML.Scheduler />
    </>
  );
}
