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
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default useStyles;
