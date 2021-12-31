import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  navbar: {
    backgroundColor: '#BF0045',
    '& a': {
      color: '#fff',
      marginLeft: 10,
    },
  },
  navRight: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  },
  grow: {
    flexGrow: 1,
  },
  main: {
    minHeight: '80vh',
  },
  footer: {
    backgroundColor: '#BF0045',
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    display: 'flex',
    justifyContent: 'space-around',
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  form: {
    width: '100%',
    maxWidth: 800,
    margin: '0 auto',
  },
  navbarButton: {
    color: '#ffffff',
    textTransform: 'initial',
  },
  transparentBackgroud: {
    backgroundColor: 'transparent',
  },
  error: {
    color: '#f04040',
  },
});

export default useStyles;
