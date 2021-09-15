import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { Flex } from 'rebass';
import { AuthenticatedRoute, UnauthenticatedRoute } from 'src/service/auth';
import { PlayerPage } from './player';
import { StartPage } from './start';
import { AdminPage } from './admin';
import { SettingsPage } from './settings';
import { QuotesPage } from './quotes';

export const PageManager: React.FC<{}> = () => {
    const location = useLocation();
    return (
        <Flex justifyContent='center' width='100%' height='auto' minHeight='100%'>
            <Flex flexDirection='column' width='100%' height='auto' minHeight='100%'>
                <Switch location={location}>
                    <Route path='/admin' component={AdminPage} />
                    <Route path='/settings' component={SettingsPage} />
                    <Route path='/quotes' component={QuotesPage} />
                    <AuthenticatedRoute path='/game' component={PlayerPage} />
                    <UnauthenticatedRoute path='/' component={StartPage} />
                </Switch>
            </Flex>
        </Flex>
    );
};
