import Segment from '../interfaces/Segment'

const fs = require('fs')
const m3u8stream = require('m3u8stream')
const mkdirp = require('mkdirp')

const download = (url: string, path: string) => {
  // TODO: Set error control
  mkdirp(path).then(() => {
    const stream = m3u8stream(url)
    stream.pipe(fs.createWriteStream(`${path}.mp4`))
    stream.on('progress', function (segment: Segment, totalSegments: number) {
      printDownloadPercentage(segment, totalSegments)
    })
  })
}

const printDownloadPercentage = (segment: Segment, totalSegments: number) => {
  // TODO: Add progress bar
  console.log(`Downloaded: ${Math.round(segment.num / totalSegments * 100)} %`)
}

// Remove extension from path
// TODO: In the future, accept more extensions than mp4
const parsePath = (path: string) => {
  return path.split('.').slice(0, -1).join('.')
}

export {
  download,
  parsePath
}
