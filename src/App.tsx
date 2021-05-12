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

const App: React.FC<{}> = () => (
    <Router>
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <ToastContainer />
            <LoadingBar />
            <AuthProvider>
                <VotesProvider>
                    <GameProvider>
                        <PageManager />
                    </GameProvider>
                </VotesProvider>
            </AuthProvider>
        </ThemeProvider>
    </Router>
);

export default App;
