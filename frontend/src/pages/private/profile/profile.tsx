import { Grid } from '@mui/material';
import axios from 'axios';
import { FC, useEffect } from 'react';
import { useMoralis } from 'react-moralis';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, useNotification } from 'web3uikit';
import { handleError } from '../../../assets/utils';
import { useAuthStore } from '../../../stores/authStore';

const Profile: FC = () => {
    const { user, setUser, token, setToken, resetToken } = useAuthStore();
    const navigate = useNavigate();
    const notification = useNotification();
    const { web3, enableWeb3, chainId } = useMoralis();

    const linkWithEthereum = async () => {
        if (web3 && chainId) {
            try {
                const address = await web3.getSigner().getAddress();
                const { data: challengeInfo } = await axios.post(process.env.REACT_APP_THIRD_PARTY_API_URL + '/auth/linkWithEthereum', {
                    address: address,
                    chainId: parseInt(chainId, 16),
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (challengeInfo.message && challengeInfo.signUrl) {
                    const signature = await web3.getSigner().signMessage(challengeInfo.message);
                    const { data: completeChallengeInfo } = await axios.post(challengeInfo.signUrl, {
                        message: challengeInfo.message,
                        signature: signature,
                    });

                    if (completeChallengeInfo.token) {
                        notification({
                            type: 'success',
                            position: 'topR',
                            title: 'Congratulations!',
                            message: `Your wallet is now linked!`
                        });
                        setToken(completeChallengeInfo.token);
                        setUser({
                            username: user?.username || '',
                            address: address || user?.address || '',
                        });
                    }
                }
            } catch (error: any) {
                const errorMessage = handleError(error, resetToken, () => {
                    navigate('/');
                });
                notification({
                    type: 'error',
                    position: 'topR',
                    title: 'Oops!',
                    message: errorMessage.message ?? JSON.stringify(errorMessage),
                });
            }
        } else {
            notification({
                type: 'error',
                position: 'topR',
                title: 'Oops!',
                message: 'Unable to find Web3Provider'
            });
        }
    }

    useEffect(() => {
        if (!web3) {
            enableWeb3();
        }
    }, [web3]);

    return (
        <>
            <Grid
                container
                sx={{
                    px: 8,
                    py: 4,
                }}
            >
                <Grid item xs={12} md={5}>
                    <Grid
                        container
                        alignItems='center'
                        justifyContent='center'
                    >
                        <Grid item xs={5} sx={{ mb: 4 }}>
                            <Typography>Username</Typography>
                        </Grid>
                        <Grid item xs={1} sx={{ mb: 4 }}>:</Grid>
                        <Grid item xs={6} sx={{ mb: 4 }}>
                            <Typography>
                                {user?.username ? user.username : 'Not available'}
                            </Typography>
                        </Grid>
                        <Grid item xs={5} sx={{ mb: 4 }}>
                            <Typography>Wallet Address</Typography>
                        </Grid>
                        <Grid item xs={1} sx={{ mb: 4 }}>:</Grid>
                        <Grid item xs={6} sx={{ mb: 4 }}>
                            {
                                user?.address ? (
                                    <Typography>
                                        {user.address}
                                    </Typography>
                                ) : (
                                    <Button
                                        text='Link with Metamask'
                                        theme='outline'
                                        size='large'
                                        type='button'
                                        icon='metamask'
                                        onClick={linkWithEthereum}
                                    />
                                )
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
};

export default Profile;
