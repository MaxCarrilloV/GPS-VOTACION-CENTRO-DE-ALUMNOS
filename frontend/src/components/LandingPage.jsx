import React from "react";
import { AppBar, Box, Container, Toolbar, Typography, Grid } from "@mui/material";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MenuIcon from '@mui/icons-material/Menu';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LoginForm from "./LoginForm.jsx";

const MainLayout = ({ children }) => {
    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: 'red' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <AccountBalanceIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.2rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            MUNICIPALIDAD
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <MenuIcon />
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <div className="landing-container">
                <LoginForm />
            </div>

            <Box component="footer" sx={{ backgroundColor: 'red', width: '100%', position: 'fixed', bottom: 0 }}>
                <Grid container alignItems="center" justifyContent="space-between" paddingX={2} paddingY={1}>
                    <Typography variant="h6" sx={{ color: 'white' }}>
                        2023© Municipalidad
                    </Typography>
                    <Box>
                        <InstagramIcon sx={{ color: 'white', fontSize: '20px', marginLeft: '10px' }} />
                        <FacebookIcon sx={{ color: 'white', fontSize: '20px', marginLeft: '10px' }} />
                        <TwitterIcon sx={{ color: 'white', fontSize: '20px', marginLeft: '10px' }} />
                    </Box>
                </Grid>
            </Box>
        </>
    );
};

export default MainLayout;
