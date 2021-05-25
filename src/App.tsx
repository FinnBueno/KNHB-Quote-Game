import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'emotion-theming';
import { ToastContainer } from 'react-toastify';
import { GlobalStyle, theme } from './service/theme/configuration';
import { PageManager } from './pages/router';
import { AuthProvider } from './service/auth/context';
import { LoadingBar } from './molecules/loading-bar';
import { GameProvider } from './service/game/player-context';
import { VotesProvider } from './service/game/votes-conext';
import 'react-toastify/dist/ReactToastify.css';
import { ScoreProvider } from './service/game/scoreboard';

const App: React.FC<{}> = () => (
    <Router>
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <ToastContainer position='bottom-right' />
            <LoadingBar />
            <AuthProvider>
                <VotesProvider>
                    <GameProvider>
                        <ScoreProvider>
                            <PageManager />
                        </ScoreProvider>
                    </GameProvider>
                </VotesProvider>
            </AuthProvider>
        </ThemeProvider>
    </Router>
);

export default App;
