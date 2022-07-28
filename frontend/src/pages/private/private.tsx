import { Grid, Tabs, Tab, Typography, useMediaQuery, useTheme } from '@mui/material';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Button, Modal, useNotification } from 'web3uikit';
import MoralisSquareLogo from '../../assets/moralisSquareLogo';
import { useAuthStore } from '../../stores/authStore';
import Home from './home/home';
import './private.css'
import Nfts from './nfts/nfts';
import axios from 'axios';
import Profile from './profile/profile';
import { handleError } from '../../assets/utils';

const Private: FC = () => {
    const notification = useNotification();
    const location = useLocation();
    const { token, setUser, user } = useAuthStore();
    const navigate = useNavigate();
    const [tab, setTab] = useState(location.pathname);
    const [isOpenLogoutModal, setIsOpenLogoutModal] = useState<boolean>(false);
    const { resetToken } = useAuthStore();
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

    const routes = [
        { text: 'Home', path: '/', element: Home },
        { text: 'NFTs', path: '/nfts', element: Nfts },
        { text: 'Profile', path: '/profile', element: Profile },
    ]

    const getUser = async () => {
        try {
            const { data } = await axios.get(process.env.REACT_APP_THIRD_PARTY_API_URL + '/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setUser(data);
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
    }

    const logout = () => {
        resetToken();
        navigate('/', {
            replace: true,
        });
        notification({
            type: 'success',
            position: 'topR',
            title: 'See you soon!',
            message: 'Successfully logged out!'
        })
    }

    const shortenAddress = (address: string | undefined): string => {
        if (address) {
            const length = address.length;
            return address.substring(0, 5) + '...' + address.substring(length - 4, length);
        } else {
            return ''
        }
    }

    useEffect(() => {
        getUser();

        const route = routes.find((route) => route.path === location.pathname);
        if (!route) {
            setTab('/');
        }
    }, [])

    return (
        <>
            <Grid container>
                <Grid
                    item xs={12}
                    container
                    alignItems='center'
                    sx={{
                        m: 2,
                    }}
                >
                    <Grid item xs={2} md={1}
                        sx={{
                            textAlign: 'center',
                        }}
                    >
                        <MoralisSquareLogo
                            fontSize='large'
                            onClick={() => {
                                navigate('/');
                            }}
                        />
                    </Grid>
                    <Grid item xs={7} md={8}>
                        <Tabs
                            value={tab}
                            onChange={(event: SyntheticEvent, value: string) => {
                                setTab(value);
                                navigate(value);
                            }}
                        >
                            {
                                routes && routes.map((route, routeKey) => {
                                    return (
                                        <Tab
                                            key={routeKey}
                                            label={route.text}
                                            value={route.path}
                                        />
                                    )
                                })
                            }
                        </Tabs>
                    </Grid>
                    <Grid item xs={3}
                        sx={{
                            textAlign: 'right'
                        }}
                    >
                        {
                            isLargeScreen && (
                                <Typography
                                    component='span'
                                    color='gray'
                                    sx={{
                                        mr: 4,
                                        // border: 'solid 0.1em #2E7DAF',
                                        // borderRadius: '0.5em',
                                        // p: 1,
                                    }}
                                >
                                    {shortenAddress(user?.address) || user?.username}
                                </Typography>
                            )
                        }
                        <Button
                            id='logout'
                            text='Logout'
                            theme='text'
                            type='button'
                            onClick={() => setIsOpenLogoutModal(true)}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Routes>
                        {
                            routes && routes.map((route, routeKey) => {
                                const RouteElement = route.element;
                                return (
                                    <Route
                                        key={routeKey}
                                        path={route.path}
                                        element={<RouteElement />}
                                    />
                                )
                            })
                        }
                        <Route path='*' element={<Navigate to='/' replace />} />
                    </Routes>
                </Grid>
            </Grid >
            <Modal
                title='Leaving so soon?'
                okText='Goodbye~'
                onOk={logout}
                cancelText='Nah'
                onCancel={() => {
                    setIsOpenLogoutModal(false);
                }}
                isVisible={isOpenLogoutModal}
                onCloseButtonPressed={() => {
                    setIsOpenLogoutModal(false);
                }}
            >
                <div
                    style={{
                        padding: '0 0 20px 0'
                    }}
                >
                    <Typography>
                        Are you sure you want to logout?
                    </Typography>
                </div>
            </Modal>
        </>
    )
}

export default Private;
