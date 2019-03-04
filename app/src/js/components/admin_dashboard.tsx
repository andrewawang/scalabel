import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
// $FlowFixMe
import {withStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {MuiThemeProvider} from '@material-ui/core/styles';
// lists
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// icons
import CreateIcon from '@material-ui/icons/Create';
import SvgIcon from '@material-ui/core/SvgIcon';
// table
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';

/** *******************/
/* Sidebar: mainList */
/** *******************/
export const mainListItems = (
  <div>
    <ListItem button onClick={goCreate}>
      <ListItemIcon>
        <CreateIcon />
      </ListItemIcon>
      <ListItemText primary="Create new project" />
    </ListItem>
  </div>
);

/** ********/
/* Styles */
/** ********/
const drawerWidth = 285;
/* type Props = {
    views: Array<Object>
}*/

const styles : any = (theme:any) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    backgroundColor: '#333',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  title: {
    flexGrow: 1,
  },
  logout: {
    alignItems: 'right',
    padding: '0 50px',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
});

/**
 * This is Dashboard component that displays
 * the everything post in the dashboard.
 * @param {Object} props
 * @return {jsx} component
 */
function Dashboard(props: { classes: any; }) {
    // $FlowFixMe
  const {classes} = props;
    /**
     * render function
     * @return {jsx} component
     */
  return (
    <div className={classes.root}>
        <CssBaseline/>
        <AppBar
            position="absolute"
            className={classNames(classes.appBar)}
        >
            <Toolbar className={classes.toolbar}>
                <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    className={classes.title}
                >
                    Scalabel Admin Dashboard
                </Typography>
                <IconButton className={classes.logout} onClick={logout}>
                  <SvgIcon >
                      <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67
                    11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2
                    2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9
                    2-2V5c0-1.1-.9-2-2-2z" fill="#ffffff"/>
                  </SvgIcon>
                </IconButton>
            </Toolbar>
        </AppBar>
        <Drawer
            variant="permanent"
            classes={{
                paper: classNames(classes.drawerPaper),
            }}
        >
            <div className={classes.toolbarIcon}/>
            <Divider/>
            <List>{mainListItems}</List>
            <Divider/>
        </Drawer>
        <main className={classes.content}>
            <div className={classes.appBarSpacer}/>
            <Typography variant="h6" gutterBottom component="h2">
                Projects
            </Typography>
            <Typography component="div" className={classes.chartContainer}>
                <ProjectTableDisplay classes = {tableStyles}/>
            </Typography>
            <div><br/></div>
            <Typography variant="h6" gutterBottom component="h2">
                Users Lists
            </Typography>
            <Typography component="div" className={classes.chartContainer}>
                <WorkersTableDisplay classes = {tableStyles}/>
            </Typography>
        </main>
    </div>);
}


/** **************/
/* AJAX request */
/** **************/
// post Ajax request for users list
let xhr = new XMLHttpRequest();
let usersToexpress: { map: (arg0: (row: any, i: any) => JSX.Element) => React.ReactNode; };
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4 && xhr.status == 200) {
    usersToexpress = JSON.parse(xhr.responseText);
  }
};
xhr.open('get', './postUsers', false);
xhr.send(null);

// post Ajax request for projects
let xhrproj = new XMLHttpRequest();
let projectsToexpress: { map: (arg0: (row: any, i: any) => JSX.Element) => React.ReactNode; };
xhrproj.onreadystatechange = function() {
  if (xhrproj.readyState == 4 && xhrproj.status == 200) {
    projectsToexpress = JSON.parse(xhrproj.responseText);
  }
};
xhrproj.open('get', './postProjectNames', false);
xhrproj.send(null);

const CustomTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#333',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 16,
  },
}))(TableCell);

declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        palette: {
            common: {
                grey: PaletteOptions
            },
        },
    }
    interface ThemeOptions {
        palette?: {
            common?: {
                grey?: PaletteOptions
            },
        },
    }
}

import createMuiTheme, {ThemeOptions} from '@material-ui/core/styles/createMuiTheme';
import {PaletteOptions} from "@material-ui/core/styles/createPalette";

const theme = createMuiTheme({ palette: {common: {grey:"#616161"},},});

const tableStyles: any = ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});

/**
 * This is projectTable component that displays
 * all the information about projects
 * @param {object} Props
 * @return {jsx} component
 */
let ProjectTable = function(Props: { classes: any; }) {
    // $FlowFixMe
  const {classes} = Props;
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <MuiThemeProvider theme={theme}>
          <TableHead >
            <TableRow>
              <CustomTableCell>Projects</CustomTableCell>
            </TableRow>
          </TableHead>
        </MuiThemeProvider>
        <TableBody>
          {projectsToexpress.map((row, i) => (
            <TableRow className={classes.row} key={i}>
              <CustomTableCell className={"align"} onClick={() => {
                toProject(row);
                }} component="th" scope="row">
                {row}
              </CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

// $FlowFixMe
let ProjectTableDisplay = withStyles(tableStyles)(ProjectTable);


let WorkersTable = function(props: { classes: any; }) {
    // $FlowFixMe
  const {classes} = props;
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <CustomTableCell>Email</CustomTableCell>
            <CustomTableCell align="right">Group</CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usersToexpress.map((row, i) => (
            <TableRow className={classes.row} key={i}>
              <CustomTableCell component="th" scope="row">
                {row.Email}
              </CustomTableCell>
              <CustomTableCell align="right">{row.Group}</CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

// $FlowFixMe
let WorkersTableDisplay = withStyles(tableStyles)(WorkersTable);

/**
 * Redirect user to create new projects
 */
function goCreate(): void {
  window.location.href = 'http://localhost:8686/create';
}

/**
 * Redirect user to logOut page
 */
function logout(): void {
  window.location.href = '/logOut';
}

/**
 * Redirect user(either admin or worker) to the project's dashboard
 * @param {string} projectName - the values to convert.
 */
function toProject(projectName: string): void{
  window.location.href = '/dashboard?project_name=' + projectName;
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
