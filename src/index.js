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
import Compressor from 'compressorjs'
import Loader from './Loader'

const Demo = ({ classes }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  // const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(2.38)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(inputSize)
  const [croppedImage, setCroppedImage] = useState(null)
  const [currentImage, setCurrentImage] = useState('')
  const [multipleImages, setMultipleImages] = useState([])
  const [inputAspectRatio, setInputAspectRatio] = useState({ x: 1, y: 1 })
  const [inputSize, setInputSize] = useState({ width: 200, height: 200 })
  const [tempInputSize, setTempInputSize] = useState({
    width: 200,
    height: 200,
  })
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [themeColor, setThemeColor] = useState('#e62466')
  const [fontColor, setFontColor] = useState('#ffffff')
  const [compressionRatio, setCompressionRatio] = useState()
  const [loading, setLoading] = useState(false)
  const onCropComplete = useCallback((inputSize, croppedAreaPixels) => {
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

  console.log('zoom', zoom)
  console.log('input', inputSize)

  const imageDimensions = (file) => {
    const img = new Image()
    // the following handler will fire after a successful loading of the image
    img.onload = async () => {
      console.log('img', img)
      const { naturalWidth: width, naturalHeight: height } = img
      console.log('width', width, 'height', height)
      //  { width, height }
    }
    // and this handler will fire if there was an error with the image (like if it's not really an image or a corrupted one)
    img.onerror = () => {
      console.log('There was some problem with the image.')
    }
    img.src = URL.createObjectURL(file)
  }

  const onSelectImage = async (e, key, data) => {
    if (!key) {
      if (e.target.files && e.target.files.length > 0) {
        setMultipleImages([...e.target.files])
        imageDimensions(e.target.files[0])
        new Compressor(e.target.files[0], {
          // quality: 100,
          resize: 'contain',
          // quality: compressionRatio / 100,
          success(result) {
            const reader = new FileReader()
            reader.addEventListener('load', () => {
              setCurrentImage(reader.result)
            })
            reader.readAsDataURL(result)
          },
          error(err) {
            console.log(err.message)
          },
        })
        // const reader = new FileReader()
        // reader.addEventListener('load', () => {
        //   setCurrentImage(reader.result)
        //   // console.log('reader', reader.result)
        // })
        // // reader.readAsDataURL(imgCompressor.result)
        // reader.readAsDataURL(e.target.files[0])
      }
    } else {
      // console.log('~~~data', data)
      new Compressor(data, {
        quality: compressionRatio / 100,
        success(result) {
          const reader = new FileReader()
          reader.addEventListener('load', () => {
            setCurrentImage(reader.result)
          })
          reader.readAsDataURL(result)
        },
        error(err) {
          console.log(err.message)
        },
      })

      // const reader = new FileReader()
      // reader.addEventListener('load', () => setCurrentImage(reader.result))
      // reader.readAsDataURL(data)
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
    var regex = new RegExp('^[^0-9]*$')
    var key = String.fromCharCode(
      !value.charCode ? value.which : value.charCode
    )
    if (regex.test(key)) {
      value.preventDefault()
      return false
    }
  }

  useEffect(() => {
    // setTimeout(() => {
    //   setLoading(false)
    // }, 100)
    // if (localStorage.getItem('inputAspectRatio')) {
    //   let tempAspect = JSON.parse(localStorage.getItem('inputAspectRatio'))
    //   setInputAspectRatio(tempAspect)
    // } else {
    //   localStorage.setItem('inputAspectRatio', JSON.stringify({ x: 1, y: 1 }))
    // }

    // if (localStorage.getItem('inputSize')) {
    //   let tempSize = JSON.parse(localStorage.getItem('inputSize'))
    //   console.log('tempSize++++++++++', tempSize)
    //   // setInputSize(tempSize)
    //   // setTempInputSize(tempSize)
    // } else {
    //   localStorage.setItem(
    //     'inputSize',
    //     JSON.stringify({ width: 300, height: 500 })
    //   )
    // }

    if (localStorage.getItem('compressionRatio')) {
      let tempCompress = JSON.parse(localStorage.getItem('compressionRatio'))
      setCompressionRatio(tempCompress)
    } else {
      localStorage.setItem('compressionRatio', JSON.stringify(60))
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

  return loading ? (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Loader color="default" />
    </div>
  ) : (
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
            justifyContent: 'space-evenly',
            width: '630px',
            marginLeft: '50px',
          }}
        >
          <div
            style={{
              display: 'flex',
              height: '20px',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              width: '150px',
            }}
          >
            <h5>Quality:</h5>
            <select
              id="compression"
              style={{ height: '30px' }}
              onChange={(e) => {
                setCompressionRatio(e.target.value)
                localStorage.setItem(
                  'compressionRatio',
                  JSON.stringify(e.target.value)
                )
              }}
              value={compressionRatio}
            >
              <option value="10">10 %</option>
              <option value="20">20 %</option>
              <option value="30">30 %</option>
              <option value="40">40 %</option>
              <option value="50">50 %</option>
              <option value="60">60 %</option>
              <option value="70">70 %</option>
              <option value="80">80 %</option>
              <option value="90">90 %</option>
            </select>
          </div>
          {/* <h5>aspect ratio :</h5>
          <p>x</p>
          <input
            type="text"
            min={1}
            max={100}
            maxLength={3}
            style={{ width: '50px', height: '25px', paddingLeft: '5px' }}
            value={inputAspectRatio.x || 1}
            onKeyDown={(e) => handleNumberInput(e)}
            onChange={(e) => {
              setInputAspectRatio({
                ...inputAspectRatio,
                x: e.target.value,
              })
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
            maxLength={3}
            style={{ width: '50px', height: '25px', paddingLeftL: '5px' }}
            value={inputAspectRatio.y || 1}
            onKeyDown={(e) => handleNumberInput(e)}
            onChange={(e) => {
              setInputAspectRatio({
                ...inputAspectRatio,
                y: e.target.value,
              })
              localStorage.setItem(
                'inputAspectRatio',
                JSON.stringify({ ...inputAspectRatio, y: e.target.value })
              )
            }}
          ></input> */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              width: '450px',
            }}
          >
            <h5>Crop size :</h5>
            <p>width</p>
            <input
              type="number"
              // min={1}
              // max={10000}
              // maxLength={5}
              style={{ width: '50px', height: '25px', paddingLeft: '5px' }}
              value={tempInputSize.width || 1}
              // onKeyDown={(e) => handleNumberInput(e)}
              onChange={(e) => {
                setTempInputSize({
                  ...tempInputSize,
                  width: +e.target.value,
                })
                // setInputSize({
                //   ...inputSize,
                //   width: e.target.value,
                // })
                // localStorage.setItem(
                //   'inputSize',
                //   JSON.stringify({ ...inputSize, width: e.target.value })
                // )
              }}
            ></input>
            <p>height</p>
            <input
              type="number"
              // min={1}
              // max={10000}
              // maxLength={5}
              style={{ width: '50px', height: '25px', paddingLeftL: '5px' }}
              value={tempInputSize.height || 1}
              // onKeyDown={(e) => handleNumberInput(e)}
              onChange={(e) => {
                setTempInputSize({
                  ...tempInputSize,
                  height: +e.target.value,
                })
                // setInputSize({
                //   ...inputSize,
                //   height: e.target.value,
                // })
                // localStorage.setItem(
                //   'inputSize',
                //   JSON.stringify({ ...inputSize, height: e.target.value })
                // )
              }}
            ></input>
            <Button
              variant="contained"
              // color={themeColor}
              classes={{ root: classes.cropButton }}
              style={{
                backgroundColor:
                  !tempInputSize.width || !tempInputSize.height
                    ? 'gray'
                    : themeColor,
                color: 'white',
                fontWeight: 'bold',
                fontshadow: `0px 0px 5px ${fontColor}`,
                stroke: '5px black',
                marginLeft: '20px',
              }}
              onClick={() => {
                setInputSize({
                  ...tempInputSize,
                })
                localStorage.setItem('inputSize', JSON.stringify(tempInputSize))
              }}
              disabled={!tempInputSize.width || !tempInputSize.height}
            >
              Set size
            </Button>
          </div>
        </div>
        <div>
          <Button
            variant="contained"
            // color={themeColor}
            classes={{ root: classes.cropButton }}
            style={{
              backgroundColor: currentImageIndex === 0 ? 'gray' : themeColor,
              color: 'white',
              fontWeight: 'bold',
              fontshadow: `0px 0px 5px ${fontColor}`,
              stroke: '5px black',
              marginLeft: '25px',
            }}
            onClick={() => previousImage()}
            disabled={currentImageIndex === 0}
          >
            previous image
          </Button>
          <Button
            variant="contained"
            // color={themeColor}
            classes={{ root: classes.cropButton }}
            style={{
              backgroundColor:
                multipleImages.length - 1 <= currentImageIndex
                  ? 'gray'
                  : themeColor,
              color: 'white',
              fontWeight: 'bold',
              fontshadow: `0px 0px 5px ${fontColor}`,
              stroke: '5px black',
              marginLeft: '25px',
            }}
            onClick={() => nextImage()}
            disabled={multipleImages.length - 1 <= currentImageIndex}
          >
            next image
          </Button>
        </div>
      </div>
      <div
        className={classes.cropContainer}
        style={{ height: '80vh', display: 'block' }}
      >
        <Cropper
          image={currentImage}
          crop={crop}
          rotation={rotation}
          minZoom="1"
          zoom={zoom}
          showGrid={true}
          // aspect={inputAspectRatio.x / inputAspectRatio.y}
          objectFit="auto-cover"
          cropSize={inputSize}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onCropAreaChange={onCropComplete}
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
            max={10}
            step={0.01}
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
