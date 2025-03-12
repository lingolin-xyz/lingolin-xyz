import axios from "axios"
import sharp from "sharp"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID
      ? process.env.AWS_S3_ACCESS_KEY_ID
      : "",
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
      ? process.env.AWS_S3_SECRET_ACCESS_KEY
      : "",
  },
  region: process.env.AWS_S3_BUCKET_REGION
    ? process.env.AWS_S3_BUCKET_REGION
    : "",
})

export const uploadWebpFromURLToAWSS3 = async (imageUrl: string) => {
  console.log(" 💥 💥 💥 💥 💥 💥 uploading webp to S3  !!LFG!! " + imageUrl)

  const newFileImage =
    "webps/" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    ".webp"

  const res = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  })

  const buffer = Buffer.from(res.data, "binary")

  // Compress the image using sharp
  const compressedBuffer = await sharp(buffer)
    .resize({ height: 740 })
    .toFormat("webp")
    .webp({ quality: 80 }) // Adjust quality as needed
    .toBuffer()

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME || "",
    Key: newFileImage,
    Body: compressedBuffer,
    ContentType: "image/webp",
  }
  await s3.send(new PutObjectCommand(params))
  return `https://${params.Bucket}.s3.${process.env.AWS_S3_BUCKET_REGION}.amazonaws.com/${params.Key}`
}

export const uploadOGGAudioFileToAWSS3 = async (buffer: Buffer) => {
  const newFileAudio =
    "oggs/" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    ".ogg"

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME || "",
    Key: newFileAudio,
    Body: buffer,
    ContentType: "audio/ogg",
  }

  await s3.send(new PutObjectCommand(params))

  const url = `https://${params.Bucket}.s3.${process.env.AWS_S3_BUCKET_REGION}.amazonaws.com/${params.Key}`
  console.log(" 💥 💥 💥 💥 💥 💥 uploaded OGG to S3  !!LFG!! " + url)
  // await postToDiscord(`💥 💥 💥 💥 💥 💥 uploaded OGG to S3  !!LFG!! ${url}`);
  return url
}

export const uploadMP3AudioFileToAWSS3 = async (buffer: Buffer) => {
  const newFileAudio =
    "mp3s/" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    ".mp3"

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME || "",
    Key: newFileAudio,
    Body: buffer,
    ContentType: "audio/mp3",
  }

  await s3.send(new PutObjectCommand(params))

  const url = `https://${params.Bucket}.s3.${process.env.AWS_S3_BUCKET_REGION}.amazonaws.com/${params.Key}`
  console.log(" 💥 💥 💥 💥 💥 💥 uploaded MP3 to S3  !!LFG!! " + url)
  // await postToDiscord(`💥 💥 💥 💥 💥 💥 uploaded MP3 to S3  !!LFG!! ${url}`);
  return url
}

export const uploadAnyImageToAWS = async (imageFile: File) => {
  console.log(" 💥 💥 💥 💥 💥 💥 uploading image to S3  !!LFG!! ")

  // Always use webp for better compression
  const newFileName =
    "lingolin-images/webps/" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    ".webp"

  // Convert File to Buffer
  const arrayBuffer = await imageFile.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Compress the image using sharp and convert to webp
  const compressedBuffer = await sharp(buffer)
    .resize({ height: 1200, withoutEnlargement: true })
    .toFormat("webp")
    .webp({ quality: 80 }) // Adjust quality as needed
    .toBuffer()

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME || "",
    Key: newFileName,
    Body: compressedBuffer,
    ContentType: "image/webp",
  }

  await s3.send(new PutObjectCommand(params))
  return `https://${params.Bucket}.s3.${process.env.AWS_S3_BUCKET_REGION}.amazonaws.com/${params.Key}`
}
