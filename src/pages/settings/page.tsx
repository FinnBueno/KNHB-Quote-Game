import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Flex, Text } from 'rebass';
import { SyncLoader } from 'react-spinners';
import firebase from 'firebase/app';
import 'firebase/auth';
import { toast } from 'react-toastify';
import { MButton } from 'src/atoms';
import { useAuth } from 'src/service/auth';
import { useTotalQuotes } from 'src/service/game/get-total-quotes';

export const SettingsPage: React.FC<{}> = () => {
    const auth = useAuth();
    const history = useHistory();
    const totalQuotes = useTotalQuotes();
    const [loading, setLoading] = useState<boolean>(false);

    const resetQuotes = () => {
        const updateQuotesRef = firebase.database().ref('/updateQuotes');
        setLoading(true);
        updateQuotesRef.set(true);
        updateQuotesRef.on('value', disableLoading);
    }

    const disableLoading = (snapshot: firebase.database.DataSnapshot) => {
        const updateQuotes = snapshot.val();
        if (!updateQuotes) {
            toast(
                'Quotes succesvol geupdate.',
                { type: 'success' }
            );
            setLoading(false);
            firebase.database().ref('/updateQuotes').off('value', disableLoading);
        }
    }

    if (!auth?.admin.isAdmin && !auth?.admin.loading) {
        history.push('/admin');
        return (
            <></>
        )
    }

    return (
        <Flex m={2} alignItems='center' justifyContent='center' height='100%' minHeight='auto'>
            <Flex maxWidth='300px' width='100%' flexDirection='column'>
                <Text variant='body' textAlign='center' mb={2}>
                    {loading ?
                        'Currently loading all quotes from Discord into the database. This should only take a few seconds!' 
                        : `There are currently ${totalQuotes} quotes registered. Click the button below to re-import all quotes from Discord.`}
                </Text>
                <MButton disabled={loading} variant='primaryLarge' onClick={resetQuotes} width='100%'>
                    {loading ? (
                        <>
                            <SyncLoader size={16} loading color='white' />
                        </>
                    ) : 'Import Quotes'}
                </MButton>
                <Flex justifyContent='space-between' width='100%' pt={1}>
                    <MButton variant='link' mt={2} onClick={() => firebase.auth().signOut()}>
                        Log out
                    </MButton>
                    <MButton variant='link' mt={2} onClick={() => history.push('/admin')}>
                        Go to Admin
                    </MButton>
                </Flex>
            </Flex>
        </Flex>
    );
}