import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { Flex } from "rebass";
import { PlayerPage } from "src/pages/player";
import { StartPage } from "src/pages/start";
import { AdminPage } from "src/pages/admin/[id]";
import { SettingsPage } from "src/pages/settings";
import { QuotesPage } from "src/pages/quotes/[id]";
import { QuotesGameSelectionPage } from "src/pages/quotes";
import { ExplanationPage } from "src/pages/explanation";
import { AdminGameSelectionPage } from "./admin/page";

export const PageManager: React.FC<{}> = () => {
  const location = useLocation();
  return (
    <Flex justifyContent="center" width="100%" height="auto" minHeight="100%">
      <Flex flexDirection="column" width="100%" height="auto" minHeight="100%">
        <Switch location={location}>
          <Route path="/admin/:gameid" component={AdminPage} />
          <Route path="/admin" exact component={AdminGameSelectionPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/quotes/:gameid" component={QuotesPage} />
          <Route path="/quotes" exact component={QuotesGameSelectionPage} />
          <Route path="/game/:gameid" component={PlayerPage} />
          <Route path="/player/:gameid" component={StartPage} />
          <Route path="/" component={ExplanationPage} />
        </Switch>
      </Flex>
    </Flex>
  );
};
