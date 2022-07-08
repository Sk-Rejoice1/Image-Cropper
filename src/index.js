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
import Resizer from 'react-image-file-resizer'
import ConvertImage from 'react-convert-image'

const Demo = ({ classes }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  // const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  // const [zoom, setZoom] = useState(2.377)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState()
  const [croppedImage, setCroppedImage] = useState(null)
  const [currentImage, setCurrentImage] = useState('')
  const [formatConvertedImage, setFormatConvertedImage] = useState(null)
  const [multipleImages, setMultipleImages] = useState([])
  const [inputAspectRatio, setInputAspectRatio] = useState({ x: 1, y: 1 })
  const [inputSize, setInputSize] = useState({
    width: 200,
    height: 200,
    x: 0,
    y: 0,
  })
  const [tempInputSize, setTempInputSize] = useState({
    width: 200,
    height: 200,
    x: 0,
    y: 0,
  })
  // const [zoomUpdatedFirst, setZoomUpdatedFirst] = useState(false)
  // const [zoomUpdated, setZoomUpdated] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [themeColor, setThemeColor] = useState('rgb(0 0 0 / 83%)')
  const [fontColor, setFontColor] = useState('#ffffff')
  const [compressionRatio, setCompressionRatio] = useState()
  const [loading, setLoading] = useState(false)
  const [media, setMedia] = useState({})
  const [relativeBtnScale, setRelativeBtnScale] = useState(1)
  const onCropComplete = useCallback((croppedArea, croppedAreaPixelsCB) => {
    // console.log(
    //   '@@@ croppedArea',
    //   croppedArea,
    //   'croppedAreaPixelsCB',
    //   croppedAreaPixelsCB
    // )
    if (inputSize.height <= inputSize.width) {
      // setTimeout(() => {
      // console.log('~~~ if >> croppedAreaPixels -----------')
      let storedInputSize = JSON.parse(localStorage.getItem('inputSize'))
      if (
        croppedAreaPixelsCB.height !== storedInputSize.height &&
        JSON.stringify(croppedAreaPixels) !==
          JSON.stringify(croppedAreaPixelsCB)
      ) {
        setCroppedAreaPixels({
          width: storedInputSize.width,
          height: storedInputSize.height,
          x: croppedAreaPixelsCB.x,
          y: croppedAreaPixelsCB.y,
        })
        // console.log(
        //   'if >> croppedAreaPixels -----------',
        //   croppedAreaPixelsCB,
        //   storedInputSize,
        //   croppedAreaPixelsCB.width,
        //   storedInputSize.width,
        //   croppedAreaPixelsCB.width / storedInputSize.width
        // )
        let expectedZoom = croppedAreaPixelsCB.width / storedInputSize.width
        setZoom(expectedZoom)
        return
      } else {
        setCroppedAreaPixels(croppedAreaPixelsCB)
        return
      }
      // }, 500)
      return
    } else if (inputSize.height > inputSize.width) {
      // setTimeout(() => {
      // console.log('~~~ else if >> croppedAreaPixels -----------')
      let storedInputSize = JSON.parse(localStorage.getItem('inputSize'))

      if (
        croppedAreaPixelsCB.width !== storedInputSize.width &&
        JSON.stringify(croppedAreaPixels) !==
          JSON.stringify(croppedAreaPixelsCB)
      ) {
        // console.log('~~~ 2 if')
        setCroppedAreaPixels({
          width: storedInputSize.width,
          height: storedInputSize.height,
          x: croppedAreaPixelsCB.x,
          y: croppedAreaPixelsCB.y,
        })
        // console.log(
        //   'else >> croppedAreaPixels -----------',
        //   croppedAreaPixelsCB,
        //   storedInputSize,
        //   croppedAreaPixelsCB.height,
        //   storedInputSize.height,
        //   croppedAreaPixelsCB.height / storedInputSize.height
        // )
        let expectedZoom = croppedAreaPixelsCB.height / storedInputSize.height
        setZoom(expectedZoom)
        // setZoomUpdatedFirst(true)
        // setZoomUpdated(zoomUpdatedFirst && true)
        // return
      } else {
        // console.log('~~~ 2 else')
        setCroppedAreaPixels(croppedAreaPixelsCB)
        // return
      }
      // }, 500)
      return
    } else {
      // console.log('~~~ else >> croppedAreaPixels -----------')
      return
    }
  }, [])
  // const onCropComplete = useCallback((inputSize, croppedAreaPixelsCB) => {
  //   setTimeout(() => {
  //     let storedInputSize = JSON.parse(localStorage.getItem('inputSize'))
  //     if (
  //       croppedAreaPixelsCB.width !== storedInputSize.width &&
  //       JSON.stringify(croppedAreaPixels) !==
  //         JSON.stringify(croppedAreaPixelsCB)
  //     ) {
  //       setCroppedAreaPixels({
  //         width: storedInputSize.width,
  //         height: storedInputSize.height,
  //         x: croppedAreaPixelsCB.x,
  //         y: croppedAreaPixelsCB.y,
  //       })
  //       console.log(
  //         'croppedAreaPixels',
  //         croppedAreaPixelsCB,
  //         storedInputSize,
  //         croppedAreaPixelsCB.width,
  //         storedInputSize.width,
  //         croppedAreaPixelsCB.width / storedInputSize.width
  //       )
  //       let expectedZoom = croppedAreaPixelsCB.width / storedInputSize.width
  //       setZoom(expectedZoom)
  //       // setZoomUpdatedFirst(true)
  //       // setZoomUpdated(zoomUpdatedFirst && true)
  //     } else {
  //       setCroppedAreaPixels({
  //         width: storedInputSize.width,
  //         height: storedInputSize.height,
  //         x: croppedAreaPixelsCB.x,
  //         y: croppedAreaPixelsCB.y,
  //       })
  //     }
  //   }, 500)
  // }, [])

  const resizeFile = (file) =>
    new Promise((resolve) => {
      console.log('resizeFile file', file)
      let storedInputSize = JSON.parse(localStorage.getItem('inputSize'))
      console.log('resizeFile storedInputSize', Resizer.imageFileResizer(file))
      Resizer.imageFileResizer(
        file,
        storedInputSize.width,
        storedInputSize.height,
        'WEBP',
        100,
        0,
        (uri) => {
          console.log('resizeFile uri', uri)
          resolve(uri)
        },
        'base64'
      )
    })

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        currentImage,
        croppedAreaPixels,
        rotation,
        inputSize
      )
      // console.log('croppedImage', croppedImage)
      // console.log('croppedImage', croppedImage)
      // if (croppedImage) {
      //   let newImage = await resizeFile(croppedImage)
      //   console.log('~~~~newImage', newImage)
      // }
      // setCroppedImage(newImage)
      setCroppedImage(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels, rotation])

  const onClose = useCallback(() => {
    setCroppedImage(null)
  }, [])

  const imageDimensions = (file) => {
    const img = new Image()
    // the following handler will fire after a successful loading of the image
    img.onload = async () => {
      // console.log('img', img && file)
      const { naturalWidth: width, naturalHeight: height } = img
      // console.log('width', width, 'height', height)
      //  { width, height }
    }
    // and this handler will fire if there was an error with the image (like if it's not really an image or a corrupted one)
    img.onerror = () => {
      console.log('There was some problem with the image.')
    }
    img.src = URL.createObjectURL(file)
  }

  const handleConvertedImage = (url) => {
    setFormatConvertedImage(url)
  }

  const onSelectImage = async (e, key, data) => {
    setZoom(1.0)
    if (!key) {
      if (e.target.files && e.target.files.length > 0) {
        console.log(e.target.files[0])
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
              console.log('result', reader)
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
      console.log('in else')
      imageDimensions(data)
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
      setZoom(1.0)
      setCurrentImageIndex(currentImageIndex + 1)
      onSelectImage(e, 'multiple', multipleImages[currentImageIndex + 1])
      // setZoomUpdatedFirst(false)
      // setZoomUpdated(false)
    } else {
      e.preventDefault()
    }
  }

  const previousImage = (e) => {
    if (currentImageIndex > 0) {
      setZoom(1.0)
      setCurrentImageIndex(currentImageIndex - 1)
      onSelectImage(e, 'multiple', multipleImages[currentImageIndex - 1])
      // setZoomUpdatedFirst(false)
      // setZoomUpdated(false)
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
    if (localStorage.getItem('inputSize')) {
      let tempSize = JSON.parse(localStorage.getItem('inputSize'))
      setInputSize(tempSize)
      setTempInputSize(tempSize)
    } else {
      localStorage.setItem(
        'inputSize',
        JSON.stringify({ width: 300, height: 500, x: 0, y: 0 })
      )
    }

    if (localStorage.getItem('compressionRatio')) {
      let tempCompress = JSON.parse(localStorage.getItem('compressionRatio'))
      setCompressionRatio(tempCompress)
    } else {
      localStorage.setItem('compressionRatio', JSON.stringify(60))
    }
  }, [])

  useEffect(() => {
    let windowScale = window.devicePixelRatio.toFixed(2)
    console.log('window scale', windowScale)
    if (windowScale >= 0.75) {
      setRelativeBtnScale(1)
    } else if (windowScale >= 0.65) {
      setRelativeBtnScale(1.33)
    } else if (windowScale >= 0.45) {
      setRelativeBtnScale(1.75)
    } else if (windowScale >= 0.33) {
      setRelativeBtnScale(3)
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
    <div
      style={{
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          // height: '150%',
          transform: `scale(${relativeBtnScale})`,
        }}
      >
        <div
          style={{
            margin: '10px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height:
              relativeBtnScale === 1
                ? '50px'
                : relativeBtnScale === 1.33
                ? '75px'
                : relativeBtnScale === 1.75
                ? '100px'
                : relativeBtnScale >= 2 && '150px',
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
                style={{ height: '30px', borderRadius: '5px' }}
                onChange={(e) => {
                  setCompressionRatio(e.target.value)
                  localStorage.setItem(
                    'compressionRatio',
                    JSON.stringify(e.target.value)
                  )
                }}
                value={compressionRatio}
              >
                {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((item) => (
                  <option key={item} value={item}>
                    {item} %
                  </option>
                ))}
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
                style={{
                  width: '50px',
                  height: '25px',
                  paddingLeft: '5px',
                  borderRadius: '5px',
                  border: '1px solid black',
                }}
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
                style={{
                  width: '50px',
                  height: '25px',
                  paddingLeftL: '5px',
                  borderRadius: '5px',
                  border: '1px solid black',
                }}
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
                  localStorage.setItem(
                    'inputSize',
                    JSON.stringify(tempInputSize)
                  )
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
      </div>
      <div
        className={classes.cropContainer}
        style={{ height: '80vh', display: 'block', objectFit: 'contain' }}
      >
        <div>
          <Cropper
            image={currentImage}
            crop={crop}
            rotation={rotation}
            minZoom="1"
            zoom={zoom}
            zoomWithScroll={false}
            showGrid={true}
            // aspect={inputAspectRatio.x / inputAspectRatio.y}
            objectFit="contain"
            restrictPosition={false}
            onMediaLoaded={(media) => {
              setZoom(1.0)
              setMedia(media)
            }}
            cropSize={inputSize}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onCropAreaChange={onCropComplete}
            // onCropComplete={!zoomUpdatedFirst && onCropComplete}
            // onCropAreaChange={!zoomUpdatedFirst && onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
      </div>
      <div
        style={{
          width: '100%',
        }}
      >
        <div className={classes.controls}>
          <div className={classes.sliderContainer}>
            <Typography
              variant="overline"
              classes={{ root: classes.sliderLabel }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <p style={{ margin: '0' }}>Zoom</p>
                <p style={{ margin: '0', opacity: '0.75' }}>
                  ({(zoom * 100).toFixed(1)}%)
                </p>
              </div>
            </Typography>
            <Slider
              value={zoom}
              min={0.1}
              max={10}
              step={0.001}
              aria-labelledby="Zoom"
              classes={{ root: classes.slider }}
              // onChange={(e, zoom) => setZoom(zoom)}
              style={{ color: themeColor }}
            />
          </div>
          <div className={classes.sliderContainer}>
            <Typography
              variant="overline"
              classes={{ root: classes.sliderLabel }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <p style={{ margin: '0' }}>Rotation</p>
                <p style={{ margin: '0', opacity: '0.75' }}>({rotation}°)</p>
              </div>
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
      </div>
      {inputSize && localStorage.getItem('inputSize') && croppedImage && (
        <div>
          <ConvertImage
            image={croppedImage}
            onConversion={handleConvertedImage}
            format="webp"
            quality={compressionRatio / 100}
          />
          {formatConvertedImage && (
            <ImgDialog
              inputSize={tempInputSize}
              setZoom={setZoom}
              img={formatConvertedImage}
              // img={croppedImage}
              onClose={onClose}
              themeColor={themeColor}
              fontColor={fontColor}
              nextImage={nextImage}
            />
          )}
        </div>
      )}
    </div>
  )
}

const StyledDemo = withStyles(styles)(Demo)

const rootElement = document.getElementById('root')
ReactDOM.render(<StyledDemo />, rootElement)
