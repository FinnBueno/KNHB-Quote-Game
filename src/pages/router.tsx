import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { Flex } from 'rebass';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { createGlobalStyle } from 'styled-components';
import { AuthenticatedRoute, UnauthenticatedRoute } from 'src/service/auth';
import { PlayerPage } from './player';
import { StartPage } from './start';
import { AdminPage } from './admin';
import { QuotesPage } from './quotes';

const duration = 200;

const TransitionStyle = createGlobalStyle`
.fade-enter {
    opacity: 0;
    z-index: 11000;
}

.fade-enter.fade-enter-active {
    opacity: 1;
    transition: opacity ${duration}ms ease-in;
    z-index: 10000;
}

.fade-exit {
    opacity: 1;
}

.fade-exit.fade-exit-active {
    opacity: 0;
    transition: opacity ${duration}ms ease-in;
}
`;

export const PageManager: React.FC<{}> = () => {
    const location = useLocation();
    return (
        <Flex justifyContent='center' width='100%' height='auto' minHeight='100%'>
            <Flex flexDirection='column' width='100%' height='auto' minHeight='100%'>
                <TransitionStyle />
                <TransitionGroup style={{ height: 'auto', minHeight: '100%', display: 'flex', justifyContent: 'center' }}>
                    <CSSTransition key={location.key} timeout={duration} classNames='fade'>
                        <Switch location={location}>
                            <Route path='/admin' component={AdminPage} />
                            <Route path='/quotes' component={QuotesPage} />
                            <AuthenticatedRoute path='/game' component={PlayerPage} />
                            <UnauthenticatedRoute path='/' component={StartPage} />
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
            </Flex>
        </Flex>
    );
};
