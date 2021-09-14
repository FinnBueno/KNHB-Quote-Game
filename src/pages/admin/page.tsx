import React, { useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { Flex, Heading, Text } from 'rebass';
import firebase from 'firebase/app';
import 'firebase/auth';
import _ from 'lodash';
import { FaBan, FaCheck, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { MButton, ProgressButton } from 'src/atoms';
import { useAuth } from 'src/service/auth';
import { signInWithGoogle } from 'src/service/firebase';
import { useGame } from 'src/service/game/player-context';
import { useParticipants } from 'src/service/game/participants';
import { useFinished } from 'src/service/game/finished';
import { theme } from 'src/service/theme/configuration';
import { ParticipantBar } from 'src/molecules/participant-bar';
import { Modal } from 'src/atoms/modal';
import { useTotalQuotes } from 'src/service/game/get-total-quotes';

export const AdminPage: React.FC<{}> = () => {
    const auth = useAuth();
    const game = useGame();
    const participants = useParticipants();
    const history = useHistory();
    const hasFinished = useFinished();
    const [showStopModal, setShowStopModal] = useState(false);
    const totalQuotes = useTotalQuotes();
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
        setShowStopModal(false);
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

    if (hasFinished) {
        return (
            <Flex m={2} flexDirection='column' alignItems='center' justifyContent='center' height='100%' minHeight='auto'>
                <Text variant='body' textAlign='center' mb={2}>The game has finished. Click here to reset the database.</Text>
                <MButton variant='primaryLarge' onClick={stop}>
                    Stop
                </MButton>
            </Flex>
        );
    } else if (!game?.quote) {
        return (
            <Flex m={2} flexDirection='column' alignItems='center' justifyContent='center' height='100%' minHeight='auto'>
                <Text variant='body' textAlign='center' mb={2}>There is no game active. Click here to start.</Text>
                <MButton variant='primaryLarge' onClick={start}>
                    Start
                </MButton>
                <MButton variant='link' mt={2} onClick={() => firebase.auth().signOut()}>
                    Log out of admin mode
                </MButton>
            </Flex>
        );
    }

    return (
        <Flex flexDirection='column' width='100%' alignItems='center'>
            <Flex flexDirection='column' width='100%' maxWidth='600px'>
                <Modal isOpen={showStopModal}>
                    <Flex flexDirection='column' m={2}>
                        <Heading variant='heading3' mb={1}>
                            Stop the game
                        </Heading>
                        <Text variant='body' mb={2}>
                            You are about to stop the game. Are you sure you want to do this? This game cannot be restored.
                        </Text>
                        <Flex justifyContent='flex-end'>
                            <MButton onClick={stop} variant='hollow' mr={2}>I'm sure</MButton>
                            <MButton onClick={() => setShowStopModal(false)} variant='primary'>Never Mind</MButton>
                        </Flex>
                    </Flex>
                </Modal>
                <Flex
                    justifyContent='space-between'
                    alignItems='center'
                    width='100%'
                    p={2}
                >
                    <MButton variant='icon' onClick={() => setShowStopModal(true)}>
                        <FaBan color={theme.colors.error} size={30} />
                    </MButton>
                    <Text variant='heading2'>
                        {(game?.quote?.id || 0) + 1} / {totalQuotes}
                    </Text>
                    <MButton variant='icon' onClick={game?.quote?.showAnswer ? () => next() : showAnswer}>
                        {game?.quote?.showAnswer ? (
                            <FaArrowRight color={theme.colors.text} size={30} />
                        ) : (
                            <FaCheck color={theme.colors.success} size={30} />
                        )}
                    </MButton>
                </Flex>
                <Text variant='body' textAlign='center'>
                    The answer is currently {game?.quote?.showAnswer ? 'visible' : 'not visible'}.
                </Text>
                <Text variant='caption' textAlign='center' my={2}>
                    Current votes
                </Text>
                {participants?.map(participant => {
                    const gotVotesFrom: string[] = [];
                    Object.keys(game?.quote?.votes || {}).map(voter => {
                        const votedFor = game?.quote?.votes[voter];
                        if (votedFor === participant.id) {
                            // this person voted for this participant, so we show them in the caption
                            // find their name instead of id
                            const name = participants.find(p => p.id === voter)?.name;
                            if (name) gotVotesFrom.push(name);
                        }
                    });
                    const isCorrect = game?.quote?.answer.toLowerCase() === participant.id;
                    return (
                        <Flex px={2} width='100%' justifyContent='center' key={participant.id}>
                            <ParticipantBar
                                {...participant}
                                caption={gotVotesFrom.length ? gotVotesFrom.join(', ') : 'No votes'}
                                side={isCorrect ? () => (
                                    <Flex mr={1}>
                                        <FaCheckCircle color={theme.colors.success} size={26} />
                                    </Flex>
                                ) : undefined}
                            />
                        </Flex>
                    );
                })}
                <MButton variant='link' mt={2} onClick={() => firebase.auth().signOut()}>
                    Log out of admin mode
                </MButton>
            </Flex>
        </Flex>
    )
}
