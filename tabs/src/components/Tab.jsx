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
import Scheduler from "./Scheduler.jsx";

export default function Tab() {
  var dialogEvent = {
    inputEvent: document.getElementById("inputEvent"),
    resourceEvent: document.getElementById("resourceEvent"),
  };
  var scheduler = new Scheduler();
  scheduler.config.resources = [
    { id: 1, name: "Rückbau" },
    { id: 2, name: "Putzarbeiten" },
    { id: 3, name: "Trockenbau" },
    { id: 4, name: "Estrich Bad/Küche" },
    { id: 5, name: "Sanitär Rückbau" },
    { id: 6, name: "Fliesenleger" },
    { id: 7, name: "Feinreinigung" },
    { id: 8, name: "Tischler" },
    { id: 9, name: "Elektriker" },
  ];
  scheduler.config.events = [
    {
      id: 1,
      start: "2021-07-04T00:00:00",
      end: "2021-07-08T00:00:00",
      text: "Event 1",
    },
    {
      id: 2,
      start: "2021-07-12T00:00:00",
      end: "2021-07-16T00:00:00",
      text: "Event 2",
    },
    {
      id: 3,
      start: "2021-01-07T00:00:00",
      end: "2021-01-14T00:00:00",
      text: "Event 3",
    },
  ];
  return (
    <div>
      <div id="ctrButtonContainer">
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
        ></Button>
        <Button
          icon={<AddIcon />}
          primary
          content="Neu"
          className="ctrButton"
          style={{ marginRight: "10px" }}
        ></Button>
      </div>
      <scheduler.HTML.Scheduler />
    </div>
  );
}
