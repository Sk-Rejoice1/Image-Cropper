import React, { useState, useCallback, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Cropper from 'react-easy-crop'
import Slider from '@material-ui/core/Slider'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import ImgDialog from './ImgDialog'
import getCroppedImg from './cropImage'
import { styles } from './styles'

const Demo = ({ classes }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const [currentImage, setCurrentImage] = useState('')
  const [multipleImages, setMultipleImages] = useState([])
  const [inputAspectRatio, setInputAspectRatio] = useState({ x: 1, y: 1 })
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [themeColor, setThemeColor] = useState('#e62466')
  const [fontColor, setFontColor] = useState('#ffffff')

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        currentImage,
        croppedAreaPixels,
        rotation
      )
      setCroppedImage(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels, rotation])

  const onClose = useCallback(() => {
    setCroppedImage(null)
  }, [])

  const onSelectImage = (e, key, data) => {
    if (!key) {
      if (e.target.files && e.target.files.length > 0) {
        setMultipleImages([...e.target.files])
        const reader = new FileReader()
        reader.addEventListener('load', () => setCurrentImage(reader.result))
        reader.readAsDataURL(e.target.files[0])
      }
    } else {
      const reader = new FileReader()
      reader.addEventListener('load', () => setCurrentImage(reader.result))
      reader.readAsDataURL(data)
    }
  }

  const nextImage = (e) => {
    if (currentImageIndex < multipleImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
      onSelectImage(e, 'multiple', multipleImages[currentImageIndex + 1])
    } else {
      e.preventDefault()
    }
  }
  const previousImage = (e) => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
      onSelectImage(e, 'multiple', multipleImages[currentImageIndex - 1])
    } else {
      e.preventDefault()
    }
  }

  const handleNumberInput = (value) => {
    var regex = new RegExp('^[^0-90-9]*$')
    var key = String.fromCharCode(
      !value.charCode ? value.which : value.charCode
    )
    if (regex.test(key)) {
      value.preventDefault()
      return false
    }
  }
console.log(window.location)
  useEffect(() => {
    if (localStorage.getItem('inputAspectRatio')) {
      let tempAspect = JSON.parse(localStorage.getItem('inputAspectRatio'))
      setInputAspectRatio(tempAspect)
    } else {
      localStorage.setItem('inputAspectRatio', JSON.stringify({ x: 1, y: 1 }))
    }

    if (window.location.href.split('=').length > 1) {
      let tempThemeColor =
        window.location.href.split('=')[
          window.location.href.split('=').length - 1
        ]

      setThemeColor(tempThemeColor)
      if (tempThemeColor) {
        const invertColor = (hex) => {
          if (hex.indexOf('#') === 0) {
            hex = hex.slice(1)
          }
          // convert 3-digit hex to 6-digits.
          if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
          }
          // invert color components
          var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
            g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
            b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16)
          // pad each with zeros and return
          return '#' + padZero(r) + padZero(g) + padZero(b)
        }

        const padZero = (str, len) => {
          len = len || 2
          var zeros = new Array(len).join('0')
          return (zeros + str).slice(-len)
        }
        let tempFontColor = invertColor(tempThemeColor)
        setFontColor(tempFontColor)
      }
    }
  }, [])

  return (
    <div>
      <div
        style={{
          margin: '10px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50px',
        }}
      >
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            setMultipleImages([])
            setCurrentImage()
            setCurrentImageIndex(0)
            onSelectImage(e)
          }}
          multiple="multiple"
        ></input>
        <div
          style={{
            display: 'flex',
            height: '20px',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '300px',
            marginLeft: '50px',
          }}
        >
          <h5>aspect ratio :</h5>
          <p>x</p>
          <input
            type="text"
            min={1}
            max={100}
            style={{ width: '50px' }}
            value={inputAspectRatio.x || 1}
            onKeyDown={(e) => handleNumberInput(e)}
            onChange={(e) => {
              setInputAspectRatio({ ...inputAspectRatio, x: e.target.value })
              localStorage.setItem(
                'inputAspectRatio',
                JSON.stringify({ ...inputAspectRatio, x: e.target.value })
              )
            }}
          ></input>
          <p>y</p>
          <input
            type="text"
            min={1}
            max={100}
            style={{ width: '50px' }}
            value={inputAspectRatio.y || 1}
            onKeyDown={(e) => handleNumberInput(e)}
            onChange={(e) => {
              setInputAspectRatio({ ...inputAspectRatio, y: e.target.value })
              localStorage.setItem(
                'inputAspectRatio',
                JSON.stringify({ ...inputAspectRatio, y: e.target.value })
              )
            }}
          ></input>
        </div>
        <div>
          <button
            onClick={() => previousImage()}
            style={{ marginLeft: '50px' }}
            disabled={currentImageIndex === 0}
          >
            previous image
          </button>
          <button
            onClick={() => nextImage()}
            style={{ marginLeft: '50px' }}
            disabled={multipleImages.length - 1 <= currentImageIndex}
          >
            next image
          </button>
        </div>
      </div>
      <div className={classes.cropContainer} style={{ height: '80vh' }}>
        <Cropper
          image={currentImage}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={inputAspectRatio.x / inputAspectRatio.y}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className={classes.controls}>
        <div className={classes.sliderContainer}>
          <Typography
            variant="overline"
            classes={{ root: classes.sliderLabel }}
          >
            Zoom
          </Typography>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            classes={{ root: classes.slider }}
            onChange={(e, zoom) => setZoom(zoom)}
            style={{ color: themeColor }}
          />
        </div>
        <div className={classes.sliderContainer}>
          <Typography
            variant="overline"
            classes={{ root: classes.sliderLabel }}
          >
            Rotation
          </Typography>
          <Slider
            value={rotation}
            min={0}
            max={360}
            step={1}
            aria-labelledby="Rotation"
            classes={{ root: classes.slider }}
            onChange={(e, rotation) => setRotation(rotation)}
            style={{ color: themeColor }}
          />
        </div>
        <Button
          onClick={showCroppedImage}
          variant="contained"
          // color={themeColor}
          classes={{ root: classes.cropButton }}
          style={{
            backgroundColor: themeColor,
            color: 'white',
            fontWeight: 'bold',
            fontshadow: `0px 0px 5px ${fontColor}`,
            stroke: '5px black',
          }}
        >
          Show Result
        </Button>
      </div>
      <ImgDialog
        img={croppedImage}
        onClose={onClose}
        themeColor={themeColor}
        fontColor={fontColor}
        nextImage={nextImage}
      />
    </div>
  )
}

const StyledDemo = withStyles(styles)(Demo)

const rootElement = document.getElementById('root')
ReactDOM.render(<StyledDemo />, rootElement)
