import { stat } from 'node:fs/promises'

import { VIDEO_SIZE } from './config.mjs'
import { runCommand } from './runtime.mjs'

const FFMPEG = process.env.PITTIQUITA_FFMPEG_PATH ?? 'ffmpeg'
const FFPROBE = process.env.PITTIQUITA_FFPROBE_PATH ?? 'ffprobe'

const videoFilter = [
  `scale=${VIDEO_SIZE.width}:${VIDEO_SIZE.height}:force_original_aspect_ratio=decrease:flags=lanczos`,
  `pad=${VIDEO_SIZE.width}:${VIDEO_SIZE.height}:(ow-iw)/2:(oh-ih)/2:color=0xf8fafc`,
  'setsar=1',
  'fps=20',
  'format=yuv420p',
].join(',')

const vp9OutputArgs = [
  '-an',
  '-c:v',
  'libvpx-vp9',
  '-crf',
  '38',
  '-b:v',
  '0',
  '-deadline',
  'good',
  '-cpu-used',
  '2',
  '-row-mt',
  '1',
]

export async function assertMediaTools() {
  try {
    await runCommand(FFMPEG, ['-version'])
    await runCommand(FFPROBE, ['-version'])
  } catch (error) {
    throw new Error(
      [
        'ffmpeg and ffprobe are required to record and validate the demo.',
        'Install ffmpeg or set PITTIQUITA_FFMPEG_PATH and PITTIQUITA_FFPROBE_PATH.',
        error.message,
      ].join('\n')
    )
  }
}

export async function normalizeRecordedVideo(sourcePath, outputPath) {
  await runCommand(FFMPEG, [
    '-hide_banner',
    '-loglevel',
    'error',
    '-y',
    '-i',
    sourcePath,
    '-vf',
    videoFilter,
    ...vp9OutputArgs,
    outputPath,
  ])
}

export async function createVideoFromScreenshots(screenshotPaths, outputPath) {
  if (screenshotPaths.length !== 5) {
    throw new Error(`Expected 5 screenshots for the fallback timeline; received ${screenshotPaths.length}`)
  }

  const durations = [2.1, 2.1, 2.2, 2.1, 3.0]
  const inputs = screenshotPaths.flatMap((screenshotPath, index) => [
    '-loop',
    '1',
    '-framerate',
    '20',
    '-t',
    String(durations[index]),
    '-i',
    screenshotPath,
  ])
  const filters = screenshotPaths.map(
    (_, index) =>
      `[${index}:v]scale=${VIDEO_SIZE.width}:${VIDEO_SIZE.height}:force_original_aspect_ratio=decrease:flags=lanczos,` +
      `pad=${VIDEO_SIZE.width}:${VIDEO_SIZE.height}:(ow-iw)/2:(oh-ih)/2:color=0xf8fafc,setsar=1[v${index}]`
  )
  const streams = screenshotPaths.map((_, index) => `[v${index}]`).join('')
  const filterGraph = `${filters.join(';')};${streams}concat=n=${screenshotPaths.length}:v=1:a=0,fps=20,format=yuv420p[out]`

  await runCommand(FFMPEG, [
    '-hide_banner',
    '-loglevel',
    'error',
    '-y',
    ...inputs,
    '-filter_complex',
    filterGraph,
    '-map',
    '[out]',
    ...vp9OutputArgs,
    outputPath,
  ])
}

export async function createGifFromVideo(videoPath, outputPath) {
  const paletteFilter = [
    '[0:v]fps=10,scale=960:-2:flags=lanczos,split[frames][palette_source]',
    '[palette_source]palettegen=max_colors=128:stats_mode=diff[palette]',
    '[frames][palette]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle[gif]',
  ].join(';')

  await runCommand(FFMPEG, [
    '-hide_banner',
    '-loglevel',
    'error',
    '-y',
    '-i',
    videoPath,
    '-filter_complex',
    paletteFilter,
    '-map',
    '[gif]',
    '-loop',
    '0',
    outputPath,
  ])
}

export async function probeMedia(filePath) {
  const { stdout } = await runCommand(FFPROBE, [
    '-v',
    'error',
    '-select_streams',
    'v:0',
    '-show_entries',
    'stream=codec_name,width,height,nb_frames:format=duration,size',
    '-of',
    'json',
    filePath,
  ])
  const parsed = JSON.parse(stdout)
  const stream = parsed.streams?.[0]

  if (!stream) throw new Error(`No video or image stream found in ${filePath}`)

  return {
    codec: stream.codec_name,
    width: Number(stream.width),
    height: Number(stream.height),
    frames: stream.nb_frames === undefined || stream.nb_frames === 'N/A'
      ? undefined
      : Number(stream.nb_frames),
    durationSeconds: Number(parsed.format?.duration),
    bytes: Number(parsed.format?.size) || (await stat(filePath)).size,
  }
}

export async function decodeMedia(filePath) {
  await runCommand(FFMPEG, [
    '-hide_banner',
    '-loglevel',
    'error',
    '-i',
    filePath,
    '-map',
    '0:v:0',
    '-f',
    'null',
    '-',
  ])
}
