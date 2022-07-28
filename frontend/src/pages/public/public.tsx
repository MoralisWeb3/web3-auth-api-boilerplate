import { Grid } from '@mui/material';
import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignIn from './signIn/signIn';
import SignUp from './signUp/signUp';

const Public: FC = () => {
    return (
        <Grid
            container
            alignItems='center'
            justifyContent='center'
        >
            <Grid item xs={12}>
                <Routes>
                    <Route path='/signIn' element={<SignIn />} />
                    <Route path='/signUp' element={<SignUp />} />
                    <Route path='*' element={<Navigate to='/signIn' />} />
                </Routes>
            </Grid>
        </Grid >
    )
}

export default Public;
