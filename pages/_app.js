import "@fullcalendar/common/main.css"; // @fullcalendar/react imports @fullcalendar/common
import "@fullcalendar/daygrid/main.css"; // @fullcalendar/timegrid imports @fullcalendar/daygrid
import "@fullcalendar/timegrid/main.css"; // @fullcalendar/timegrid is a direct import
// (and @fullcalendar/interaction has no stylesheet)
import "../styles/globals.scss";

import React from "react";

import { ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import { useRouter } from "next/router";

import {
  LeftSidebar,
  LoggedInInaccessibleRoute,
  MainContainer,
  Navbar,
  ProtectedRoute,
} from "../components";
import {
  LOGGED_IN_INACCESSIBLE_ROUTES,
  PROTECTED_ROUTES,
} from "../components/common/Routes";
import { AuthContextProvider } from "../contexts/AuthContext";
import { BackdropLoaderProvider } from "../contexts/BackdropLoaderContext";
import { ResponseDialogProvider } from "../contexts/ResponseDialogContext";
import { defaultTheme } from "../modules/theme";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isLoggedInInaccessible = LOGGED_IN_INACCESSIBLE_ROUTES.includes(
    router.pathname
  );
  const isProtected = PROTECTED_ROUTES.includes(router.pathname);

  return (
    <>
      <Head>
        <title>RM Aquino Medical Clinic</title>
        <meta name="description" content="RM Aquino Medical Clinic" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="icon" href="/app-logo.svg" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <ThemeProvider theme={defaultTheme}>
        <AuthContextProvider>
          <BackdropLoaderProvider>
            <ResponseDialogProvider>
              <Navbar />
              <LeftSidebar />
              <MainContainer>
                {
                  // should NOT be logged in to access routes
                  isLoggedInInaccessible ? (
                    <LoggedInInaccessibleRoute>
                      <Component {...pageProps} />
                    </LoggedInInaccessibleRoute>
                  ) : // should be logged in to access routes
                  isProtected ? (
                    <ProtectedRoute>
                      <Component {...pageProps} />
                    </ProtectedRoute>
                  ) : (
                    // accessible to anyone routes
                    <Component {...pageProps} />
                  )
                }
              </MainContainer>
            </ResponseDialogProvider>
          </BackdropLoaderProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
