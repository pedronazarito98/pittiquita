import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  formatValidationReport,
  validateDemoArtifacts,
} from './demo/validation.mjs'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

validateDemoArtifacts(rootDir)
  .then((report) => {
    console.log(formatValidationReport(report))
  })
  .catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
