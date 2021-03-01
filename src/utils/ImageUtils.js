import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'react-native-fetch-blob'

const resizeDefault = async (photo) => {

  const quality = 80
  let newWidth = 1125
  let newHeight = 2436

  if (photo.height &&
    photo.width) {
    newHeight = (photo.height / photo.width) * newWidth
  }

  return resize(photo.path, newWidth, newHeight, 'JPEG', quality)
}

const resize = async (imageUri, newWidth, newHeight, compressFormat, quality) => {

  return ImageResizer.createResizedImage(imageUri, newWidth, newHeight, compressFormat, quality)
    .then((image_resizer) => {


      const currentTimestamp = new Date().getTime()
      const fileName = image_resizer.name.split(".")[0];
      const file_name = currentTimestamp + '_' + fileName

      const body = {
        ...image_resizer,
        file_name
      }
      return Promise.resolve(body)

    }).catch((err) => {
      return Promise.reject(null)
    });
}

const imagePathToBase64 = async image_path => {
  try {

    const base64 = await RNFetchBlob.fs.readFile(image_path, 'base64')
    return Promise.resolve({
      base64: `data:image/jpeg;base64,${base64}`
    })
  } catch (error) {
    return Promise.reject(null)
  }
}

export default {
  resize,
  resizeDefault,
  imagePathToBase64
}
