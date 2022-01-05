const classes = {
  flex: {
    display: 'flex',
    '& img': {
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  visible: {
    display: 'initial',
  },
  hidden: {
    display: 'none',
  },
  sort: {
    marginRight: 1,
  },
  fullHeight: { height: '100vh' },
  fullWidth: {
    width: '100%',
  },
  error: {
    color: '#f04040',
  },
  form: {
    width: '100%',
    maxWidth: 800,
    margin: '0 auto',
  },
  main: {
    marginTop: 2,
    minHeight: '80vh',
  },
  footer: {
    backgroundColor: '#BF0045',
    color: '#fff',
    textAlign: 'center',
    marginTop: 1,
    display: 'flex',
    justifyContent: 'space-around',
  },
  section: {
    marginTop: 1,
    marginBottom: 1,
  },
  appbar: {
    backgroundColor: '#BF0045',
    '& a': {
      color: '#ffffff',
      marginLeft: 1,
    },
  },
  toolbar: {
    justifyContent: 'space-between',
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  grow: {
    flexGrow: 1,
  },
  navbarButton: {
    color: '#ffffff',
    textTransform: 'initial',
  },
  menuButton: { padding: 0 },
  searchForm: {
    border: '1px solid #ffffff',
    borderRadius: "5px",
    backgroundColor: '#ffffff55'
  },
  searchInput: {
    paddingLeft: "1rem",
  },
  searchButton: {
    padding: ".5rem",
    borderRadius: '0 5px 5px 0',
  },
  navRight: {
    display: 'flex',
  },
  reviewItem: {
    marginRight: '1rem',
    borderRight: '1px #808080 solid',
    paddingRight: '1rem',
  },
  cardMediaImage: {
    maxHeight: "15rem",
    objectFit: "contain",
  }
};

export default classes;
