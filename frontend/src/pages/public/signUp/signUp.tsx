import { Divider, Grid } from '@mui/material';
import axios from 'axios';
import { base58 } from 'ethers/lib/utils';
import { FC, useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Typography, useNotification } from 'web3uikit';
import { TIconType } from 'web3uikit/dist/components/Icon/collection';
import { handleError } from '../../../assets/utils';
import { useAuthStore } from '../../../stores/authStore';

const SignUp: FC = () => {
    const { web3, enableWeb3, chainId } = useMoralis();
    const navigate = useNavigate();
    const { setToken, resetToken } = useAuthStore();
    const notification = useNotification();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const signUpLocal = async () => {
        if (username && password) {
            try {
                const { data } = await axios.post(process.env.REACT_APP_THIRD_PARTY_API_URL + '/auth/signUp', {
                    username,
                    password,
                });
                if (data.token) {
                    setToken(data.token);
                }
            } catch (error: any) {
                const errorMessage = handleError(error, resetToken);
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
                message: 'Please complete the required details'
            });
        }
    }

    const signUpMetamask = async () => {
        if (web3 && chainId) {
            try {
                const { data: challengeInfo } = await axios.post(process.env.REACT_APP_THIRD_PARTY_API_URL + '/auth/signUp/evm', {
                    address: await web3.getSigner().getAddress(),
                    chainId: parseInt(chainId, 16),
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
                            message: `You are logged in!`
                        });
                        setToken(completeChallengeInfo.token);
                    }
                }
            } catch (error: any) {
                const errorMessage = handleError(error, resetToken);
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

    const signUpSolana = async () => {
        const solana = await (window as any).solana;
        if (solana) {
            try {
                await solana.connect();
                const { data: challengeInfo } = await axios.post(process.env.REACT_APP_THIRD_PARTY_API_URL + '/auth/signUp/solana', {
                    address: solana.publicKey.toBase58(),
                    network: 'mainnet',
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
                            message: `You are logged in!`
                        });
                        setToken(completeChallengeInfo.token);
                    }
                }
            } catch (error: any) {
                const errorMessage = handleError(error, resetToken);
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
                message: 'Unable to find Solana Provider'
            });
        }
    }

    useEffect(() => {
        if (!web3) {
            enableWeb3();
        }
    }, [web3]);

    const signUpOptions = [
        { icon: 'metamask', text: 'Sign Up with Metamask', callback: signUpMetamask },
        { icon: 'solana', text: 'Sign Up with Solana', callback: signUpSolana },
    ]

    return (
        <Grid
            container
            alignItems='center'
            justifyContent='center'
            sx={{
                height: '100vh'
            }}
        >
            <Grid>
                <Grid item xs={12}
                    sx={{
                        mb: 4,
                        textAlign: 'center',
                        "& button": {
                            display: 'inline',
                        },
                    }}
                >
                    <Typography>
                        Already have an account?
                        <Button
                            onClick={() => {
                                navigate('/signIn');
                            }}
                            text="Sign In"
                            theme="text"
                            type="button"
                        />
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ mb: 4 }}>
                    <Input
                        label="Username"
                        onChange={(event) => {
                            setUsername(event.target.value);
                        }}
                        type="email"
                        validation={{
                            required: true
                        }}
                    />
                </Grid>
                <Grid item xs={12} sx={{ mb: 4 }}>
                    <Input
                        label="Password"
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                        type="password"
                        validation={{
                            required: true
                        }}
                    />
                </Grid>
                <Grid item xs={12} sx={{ mb: 2 }}>
                    <Button
                        onClick={signUpLocal}
                        text="Sign Up"
                        theme="primary"
                        type="button"
                        isFullWidth
                    />
                </Grid>
                <Grid item xs={12} sx={{ my: 4 }}>
                    <Divider
                        sx={{
                            color: 'gray',
                        }}
                    >
                        or
                    </Divider>
                </Grid>
                {
                    signUpOptions && signUpOptions.map((signUpOption, signUpOptionKey) => {
                        return (
                            <Grid
                                key={signUpOptionKey}
                                item
                                xs={12}
                                sx={{
                                    textAlign: 'center',
                                    m: 2,
                                    "& button": {
                                        mx: 'auto',
                                    }
                                }}
                            >
                                <Button
                                    text={signUpOption.text}
                                    theme='outline'
                                    size='large'
                                    type='button'
                                    icon={signUpOption.icon as TIconType}
                                    onClick={signUpOption.callback}
                                />
                            </Grid>
                        )
                    })
                }
            </Grid >
        </Grid>
    )
}

export default SignUp;
