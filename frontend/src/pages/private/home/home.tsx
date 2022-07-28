import { FC } from 'react';
import './home.css';
import SignInMetamaskBanner from '../../../assets/signInMetamaskBanner';
import { Card, CardContent, Divider, Grid, Typography } from '@mui/material';

const Home: FC = () => {
    return (
        <Grid
            container
            alignItems='center'
            justifyContent='center'
        >
            <Grid item xs={3} />
            <Grid
                item
                xs={10} md={6}
                sx={{
                    textAlign: 'center',
                }}
            >
                <Typography variant='h4' sx={{ mb: 2 }}>Authenticate your users</Typography>
                <Typography variant='body1' color='gray'>
                    Developers love Moralis as it saves up to 80% of the development time due to zero configuration features such as Moralis Identity.
                </Typography>
            </Grid>
            <Grid item xs={3} />
            <Grid
                item
                xs={12} md={6}
                sx={{
                    textAlign: 'center',
                    pt: 2,
                }}
            >
                <SignInMetamaskBanner />
            </Grid>
            <Grid
                item
                xs={12} md={6}
                sx={{
                    textAlign: 'center',
                    px: 4,
                    py: 2,
                }}
            >
                <Card sx={{ mb: 2 }} elevation={4}>
                    <CardContent>
                        <Typography variant='h5'>Easy Authentication</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant='body1' color='gray'>One line of code to authenticate users on any blockchain via any wallet. Moralis also supports web3 social login via Google, Twitter etc.</Typography>
                    </CardContent>
                </Card>
                <Card sx={{ mb: 2 }} elevation={4}>
                    <CardContent>
                        <Typography variant='h5'>Flexible Identity Management</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant='body1' color='gray'>Consolidate user addresses across multiple networks and auth providers into a single user profile.</Typography>
                    </CardContent>
                </Card>
                <Card sx={{ mb: 2 }} elevation={4}>
                    <CardContent>
                        <Typography variant='h5'>Effortless Session Management</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant='body1' color='gray'>Create, verify and invalidate user sessions. Moralis handles all the complex heavy lifting such as wallet signature verification, cookies etc.</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default Home;
