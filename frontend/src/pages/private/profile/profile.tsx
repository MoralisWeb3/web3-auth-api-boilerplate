import { Grid } from '@mui/material';
import axios from 'axios';
import { base58 } from 'ethers/lib/utils';
import { FC, useEffect } from 'react';
import { useMoralis } from 'react-moralis';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, useNotification } from 'web3uikit';
import { TIconType } from 'web3uikit/dist/components/Icon/collection';
import { handleError } from '../../../assets/utils';
import { useAuthStore } from '../../../stores/authStore';

const Profile: FC = () => {
    const { user, setUser, token, setToken, resetToken } = useAuthStore();
    const navigate = useNavigate();
    const notification = useNotification();
    const { web3, enableWeb3, chainId } = useMoralis();

    const linkWithMetamask = async () => {
        if (web3 && chainId) {
            try {
                const address = await web3.getSigner().getAddress();
                const { data: challengeInfo } = await axios.post(process.env.REACT_APP_THIRD_PARTY_API_URL + '/auth/link/evm', {
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

    const linkWithSolana = async () => {
        const solana = await (window as any).solana;
        if (solana) {
            try {
                await solana.connect();
                const { data: challengeInfo } = await axios.post(process.env.REACT_APP_THIRD_PARTY_API_URL + '/auth/link/solana', {
                    address: solana.publicKey.toBase58(),
                    network: 'mainnet',
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (challengeInfo.message && challengeInfo.signUrl) {
                    const encodedMessage = new TextEncoder().encode(challengeInfo.message);
                    const { signature } = await solana.signMessage(encodedMessage, 'utf8');
                    const { data: completeChallengeInfo } = await axios.post(challengeInfo.signUrl, {
                        message: challengeInfo.message,
                        signature: base58.encode(signature),
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
                            address: solana.publicKey.toBase58() || user?.address || '',
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

    const linkOptions = [
        { icon: 'metamask', text: 'Link with Metamask', callback: linkWithMetamask },
        { icon: 'solana', text: 'Link with Solana', callback: linkWithSolana },
    ]

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
                                    <>
                                        {
                                            linkOptions && linkOptions.map((linkOption, linkOptionKey) => {
                                                return (
                                                    <Grid
                                                        key={linkOptionKey}
                                                        item
                                                        xs={12}
                                                        sx={{
                                                            mb: 2,
                                                        }}
                                                    >
                                                        <Button
                                                            text={linkOption.text}
                                                            theme='outline'
                                                            size='large'
                                                            type='button'
                                                            icon={linkOption.icon as TIconType}
                                                            onClick={linkOption.callback}
                                                        />
                                                    </Grid>
                                                )
                                            })
                                        }
                                    </>
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
