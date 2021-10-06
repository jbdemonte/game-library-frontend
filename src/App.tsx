import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Desktop } from './components/Desktop';

// https://mui.com/components/typography/#general
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
  palette: {
    background: {
      default: "#1e1f21"
    },
    text: {
      primary: "#ffffff"
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Desktop />
    </ThemeProvider>
  );
}

export default App;
