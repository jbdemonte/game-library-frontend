import { Alert, createTheme, CssBaseline, Snackbar, ThemeProvider } from '@mui/material';
import { Desktop } from './components/Desktop';
import { useToastContext, ToastContext } from './contexts/toast.context';

// https://mui.com/components/typography/#general
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: "#1e1f21"
    },
  },
});

function App() {
  const { error, toastContextValue, snackbarProps } = useToastContext();
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ToastContext.Provider value={toastContextValue}>
        <Desktop />
      </ToastContext.Provider>

      <Snackbar {...snackbarProps} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'right'}}>
        <Alert onClose={snackbarProps.onClose} severity="error" sx={{ width: '100%' }}>
          {typeof error === 'string' ? error : error?.message || 'Unknown error'}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
