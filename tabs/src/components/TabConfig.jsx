import React from "react";
import "./App.css";
import * as microsoftTeams from "@microsoft/teams-js";
import {
  Input,
  Button,
  Flex,
  FlexItem,
} from "@fluentui/react-northstar";
/**
 * The 'Config' component is used to display your group tabs
 * user configuration options.  Here you will allow the user to
 * make their choices and once they are done you will need to validate
 * their choices and communicate that to Teams to enable the save button.
 */
class TabConfig extends React.Component {
  render() {
    // Initialize the Microsoft Teams SDK
    microsoftTeams.initialize();

    /**
     * When the user clicks "Save", save the url for your configured tab.
     * This allows for the addition of query string parameters based on
     * the settings selected by the user.
     */
    microsoftTeams.settings.registerOnSaveHandler((saveEvent) => {
      const baseUrl = `https://${window.location.hostname}:${window.location.port}`;
      microsoftTeams.settings.setSettings({
        suggestedDisplayName: "Bauzeitenplan",
        entityId: "Test",
        contentUrl: baseUrl + "/index.html#/tab",
        websiteUrl: baseUrl + "/index.html#/tab",
      });
      saveEvent.notifySuccess();
    });

    //Set valid when all information is valid
    microsoftTeams.settings.setValidityState(true);

    return (
      <div>
        <h1>Bauzeitenplan</h1>

        <div style={{ width: 200 }}>
          <Flex column gap="gap.small">


            <Flex gap="gap.small">
              <Input
                type="date"
                label="Von:"
                fluid
              />
              <Input
                type="date"
                label="Bis:"
                fluid
              />
            </Flex>
          </Flex>
        </div>

      </div>
    );
  }
}

export default TabConfig;
