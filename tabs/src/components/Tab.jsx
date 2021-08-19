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

  scheduler.config.date = {
    start: new Date(2021, 0, 1),
    end: new Date(2021, 1, 14),
  };
  scheduler.config.resources = [
    { id: 0, name: "Rückbau", color: "#7b83eb"},
    { id: 1, name: "Putzarbeiten", color: "#8bc34a" },
    { id: 2, name: "Trockenbau", color:  "#7b83eb" },
    { id: 3, name: "Estrich Bad/Küche", color: "#7b83eb"},
    { id: 4, name: "Sanitär Rückbau", color: "#f44336"},
    { id: 5, name: "Fliesenleger", color: "#7b83eb" },
    { id: 6, name: "Feinreinigung", color: "#7b83eb" },
    { id: 7, name: "Tischler", color:  "#7b83eb" },
    { id: 8, name: "Elektriker", color:  "#7b83eb" },
  ];
  scheduler.config.events = [
    {
      id: 3,
      start: "2021-01-04T00:00:00",
      end: "2021-01-14T00:00:00",
      text: "Trocknen",
      
    },
    {
      id: 4,
      start: "2021-01-14",
      end: "2021-01-17",
      text: "Bodenfliesen",
      
    },
  ];
  const [stateResources, setStateResources] = scheduler.config.dialog.resources;
  
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
          content="Neu"
          className="ctrButton"
          style={{ marginRight: "10px" }}
        ></Button>
      </div>
      <scheduler.HTML.Scheduler />
    </div>
  );
}
