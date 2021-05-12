import React from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { Flex } from 'rebass';
import firebase from 'firebase/app';
import 'firebase/auth';
import { MButton, ProgressButton } from 'src/atoms';
import { useAuth } from 'src/service/auth';
import { signInWithGoogle } from 'src/service/firebase';
import { useGame } from 'src/service/game/player-context';
import _ from 'lodash';
import { useParticipants } from 'src/service/game/participants';
import { useFinished } from 'src/service/game/finished';

export const AdminPage: React.FC<{}> = () => {
    const auth = useAuth();
    const game = useGame();
    const participants = useParticipants();
    const history = useHistory();
    const hasFinished = useFinished();
    const backToStart = () => history.push('/');

    if (!auth?.admin.isAdmin && !auth?.admin.loading) {
        return (
            <Flex variant='center-container' mt={3} alignItems='center' flexDirection='column'>
                <ProgressButton
                    mb={2}
                    variant='social-google'
                    scope='sign-in'
                    onClick={(e) => {
                        e.preventDefault();
                        trackPromise(
                            signInWithGoogle(),
                            'sign-in'
                        )
                    }}
                >
                    Login als admin
                </ProgressButton>
                <MButton variant='link' onClick={backToStart} p={2}>
                    Terug naar speler scherm
                </MButton>
            </Flex>
        )
    }

    const next = (message?: string) => {
        game?.next(
            success => {
                if (success) {
                    toast(
                        message || 'Nieuwe quote geselecteerd.',
                        { type: 'success' }
                    );
                } else {
                    toast(
                        'Je hebt geen toestemming om dit te doen.',
                        { type: 'error' }
                    );
                }
            }
        );
    }

    const stop = () => {
        firebase.database().ref('isGameOver').set(false);
        firebase.database().ref('activeQuote').remove()
            .then(() => toast(
                'Spel gestopt.',
                { type: 'success' }
            ))
            .catch(() => toast(
                'Je hebt geen toestemming om dit te doen.',
                { type: 'error' }
            ));
    }
    const start = () => {
        // randomize the quotes list
        const quotesRef = firebase.database().ref('quotes');
        quotesRef.once('value').then(snapshot => {
            console.log(snapshot.val());
            participants?.forEach(({ id }) => firebase.database().ref(`participants/${id}/score`).set(0));
            quotesRef.set(_.shuffle(snapshot.val()))
                .then(() => {
                    next('Spel gestart.');
                })
                .catch(() => toast(
                    'Je hebt geen toestemming om dit te doen.',
                    { type: 'error' }
                ));
        });
    }
    const showAnswer = () => {
        firebase.database().ref('activeQuote/showAnswer').set(true)
            .then(() => {
                game?.persistAnswers();
                toast(
                    'Antwoord wordt getoond.',
                    { type: 'success' }
                );
            })
            .catch(() => toast(
                'Je hebt geen toestemming om dit te doen.',
                { type: 'error' }
            ));
    }
    return (
        <Flex m={2} flexDirection='column' alignItems='center' justifyContent='center' height='100%' minHeight='auto'>
            {game?.quote || hasFinished ? (
                <Flex width='100%' flexDirection='column'>
                    <MButton mb={2} variant='primaryLarge' onClick={showAnswer}>
                        Antwoord
                    </MButton>
                    <MButton mb={2} variant='primaryLarge' onClick={next as any}>
                        Volgende
                    </MButton>
                    <MButton variant='primaryLarge' onClick={stop}>
                        Stoppen
                    </MButton>
                </Flex>
            ) : (
                <MButton variant='primaryLarge' onClick={start}>
                    Start
                </MButton>
            )}
            <MButton variant='link' mt={2} onClick={() => firebase.auth().signOut()}>
                Log uit als admin
            </MButton>
        </Flex>
    );
}
