import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import { Button } from '@material-ui/core'

const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  imgContainer: {
    position: 'relative',
    flex: 1,
    padding: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: `${
      localStorage.getItem('inputSize')
        ? JSON.parse(localStorage.getItem('inputSize')).width
        : '500'
    }px`,
    height: `${
      localStorage.getItem('inputSize')
        ? JSON.parse(localStorage.getItem('inputSize')).height
        : '700'
    }px`,
    maxWidth: `${
      localStorage.getItem('inputSize')
        ? JSON.parse(localStorage.getItem('inputSize')).width
        : '500'
    }px`,
    maxHeight: `${
      localStorage.getItem('inputSize')
        ? JSON.parse(localStorage.getItem('inputSize')).height
        : '700'
    }px`,
  },
  img: {
    width: `${
      localStorage.getItem('inputSize')
        ? JSON.parse(localStorage.getItem('inputSize')).width
        : '500'
    }px`,
    height: `${
      localStorage.getItem('inputSize')
        ? JSON.parse(localStorage.getItem('inputSize')).height
        : '700'
    }px`,
    maxWidth: `${
      localStorage.getItem('inputSize')
        ? JSON.parse(localStorage.getItem('inputSize')).width
        : '500'
    }px`,
    maxHeight: `${
      localStorage.getItem('inputSize')
        ? JSON.parse(localStorage.getItem('inputSize')).height
        : '700'
    }px`,
  },
}
// console.log(localStorage.getItem('inputSize'));

function Transition(props) {
  return <Slide direction="up" {...props} />
}

class ImgDialog extends React.Component {
  state = {
    open: true,
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    const { classes } = this.props
    return (
      <Dialog
        fullScreen
        open={!!this.props.img}
        onClose={this.props.onClose}
        TransitionComponent={Transition}
      >
        <AppBar
          className={classes.appBar}
          style={{
            backgroundColor: 'rgb(128 126 126 / 20%)',
            color: 'black',
            width: `4040px`,
            position: 'sticky',
            top: 0,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={this.props.onClose}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              Cropped image &nbsp;
              <a
                className={classes.flex}
                href={this.props.img}
                download={true}
                style={{
                  textDecoration: 'none',
                  textAlign: 'center',
                }}
                onClick={(e) => {
                  setTimeout(() => {
                    this.props.onClose()
                    this.props.setZoom(1)
                    this.props.nextImage(e)
                  }, 250)
                }}
              >
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: this.props.themeColor,
                    color: 'white',
                    fontWeight: 'bold',
                    fontshadow: `0px 0px 5px ${this.props.fontColor}`,
                    stroke: '5px black',
                    marginLeft: '50px',
                  }}
                >
                  download
                </Button>
              </a>
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.imgContainer}>
          <img src={this.props.img} alt="Cropped" className={classes.img} />
        </div>
      </Dialog>
    )
  }
}

export default withStyles(styles)(ImgDialog)
