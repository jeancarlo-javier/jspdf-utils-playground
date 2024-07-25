import {
  getMaxTextWidth,
  calcCursorYPosition,
  calcCursorYPositionText,
  getDocWidth,
  centerTextHorizontal,
  calcXPosition,
  calcYPosition
} from './pdfUtils'
import type {
  BaseTextOptions,
  AddLineOptions,
  BaseElementOptions,
  BlockContext
} from '../types/pdfUtils.types'
import type { jsPDF } from 'jspdf'

export function addText(
  doc: jsPDF,
  blockContext: BlockContext,
  text: string,
  options: BaseTextOptions = {}
): void {
  doc.setFontSize(options.fontSize || 16)

  if (blockContext.numberOfElements > 0) {
    blockContext.updateCursorYPosition(
      blockContext.cursorYPosition - blockContext.paddingVertical
    )
  }

  const elementOptions: BaseElementOptions = {
    maxWidth: getMaxTextWidth(options.maxWidth || 0, getDocWidth(doc), blockContext)
  }

  let { x = 0, y = 0 } = options
  const { textCenter } = options

  if (textCenter) x = centerTextHorizontal(doc, text, options)

  // getTextWidth(doc, text, options)
  x = calcXPosition(doc, blockContext, x, text, options)

  y = calcYPosition(y, blockContext, {
    topOffset: options.topOffset,
    bottomOffset: options.bottomOffset
  })

  doc.text(
    text,
    x,
    y,
    {
      baseline: 'top',
      maxWidth: elementOptions.maxWidth,
      align: options.textAlign
    }
    // 'center'
  )

  blockContext.updateCursorYPosition(
    calcCursorYPositionText(doc, blockContext, options, elementOptions.maxWidth || 0, text)
  )

  blockContext.addElement()
}

export function addLine(
  doc: jsPDF,
  blockContext: BlockContext,
  options: AddLineOptions = {}
): void {
  if (blockContext.numberOfElements > 0) {
    blockContext.updateCursorYPosition(
      blockContext.cursorYPosition - blockContext.paddingVertical
    )
  }

  let { y = 0 } = options

  y = calcYPosition(y, blockContext, {
    topOffset: options.topOffset,
    bottomOffset: options.bottomOffset,
    marginTop: options.marginTop,
    marginBottom: options.marginBottom
  })
  // console.log(options.topOffset, options.bottomOffset)

  doc.line(0, y, getDocWidth(doc), y)

  blockContext.updateCursorYPosition(
    calcCursorYPosition(blockContext, {
      marginBottom: options.marginBottom,
      marginTop: options.marginTop
    })
  )

  blockContext.addElement()
}

export default {
  addText,
  addLine
}
