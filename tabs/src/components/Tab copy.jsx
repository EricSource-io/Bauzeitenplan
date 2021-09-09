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
import { Scheduler, Resource, Event } from "./Scheduler.jsx";

export default function Tab() {
  var dialogEvent = {
    inputEvent: document.getElementById("inputEvent"),
    resourceEvent: document.getElementById("resourceEvent"),
  };
  var scheduler = new Scheduler();

  scheduler.config.date = {
    start: new Date(2021, 0, 1),
    end: new Date(2021, 1, 14),
  };
  scheduler.config.resources = [
    new Resource(0, "Rückbau", "#7b83eb"),
    new Resource(1, "Putzarbeiten", "#7b83eb"),
    new Resource(2, "Trockenbau", "#7b83eb"),
    new Resource(3, "Estrich Bad/Küche", "#8bc34a"),
    new Resource(4, "Sanitär Rückbau", "#7b83eb"),
    new Resource(5, "Fliesenleger", "#7b83eb"),
    new Resource(6, "Feinreinigung", "#7b83eb"),
    new Resource(7, "Tischler", "#7b83eb"),
    new Resource(8, "Elektriker", "#7b83eb"),
    
  ];
  scheduler.config.events = [
    new Event(3, "2021-01-04", "2021-01-14", "Trocknen"),
    new Event(4, "2021-01-14", "2021-01-17", "Bodenfliesen"),
  ];
  const [stateResources, setStateResources] = scheduler.config.dialog.resources;
  const [stateEvent, setStateEvent] = scheduler.config.dialog.event;

  return (
    <div>
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
          content="Ressourcen verwalten"
          className="ctrButton"
          onClick={() => setStateResources(true)}
        ></Button>
        <Button
          icon={<AddIcon />}
          primary
          content="Event"
          className="ctrButton"
          style={{ marginRight: "10px" }}
          onClick={() => setStateEvent(true)}
        ></Button>
      </div>
      <scheduler.HTML.Scheduler />
    </div>
  );
}
