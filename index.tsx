import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme, CssBaseline, GlobalStyles } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const theme = createTheme({
  palette: {
    background: {
      default: '#f7f9fc',
      paper: '#ffffff',
    }
  },
  components: {
    MuiButtonBase: {
        defaultProps: {
            disableRipple: true,
        },
    },
  }
});

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles
            styles={{
              '*::-webkit-scrollbar': {
                width: '6px',
                height: '6px',
              },
              '*::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '*::-webkit-scrollbar-thumb': {
                background: '#ccc',
                borderRadius: '3px',
              },
              '*::-webkit-scrollbar-thumb:hover': {
                background: '#aaa',
              },
              // For Firefox
              '*': {
                scrollbarWidth: 'thin',
                scrollbarColor: `#ccc transparent`,
              },
            }}
          />
          <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);