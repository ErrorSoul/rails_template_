import {css} from 'styled-components'
import ucfirst from 'ucfirst'
import media from '../utils/media'

const sizeClasses = ['xs', 'sm', 'md', 'lg', 'xl']

export const cssHelpersProps = sizeClasses.map(sizeClass => {
  const s = (sizeClass === 'xs' ? '' : ucfirst(sizeClass))

  return [
    `d${s}None`,
    `d${s}Inline`,
    `d${s}InlineBlock`,
    `d${s}Block`,
    `d${s}Table`,
    `d${s}TableCell`,
    `d${s}TableRow`,
    `d${s}Flex`,
    `d${s}InlineFlex`,
    `text${s}Monospace`,
    `text${s}Justify`,
    `text${s}Nowrap`,
    `text${s}Truncate`,
    `text${s}Left`,
    `text${s}Right`,
    `text${s}Center`,
    `flex${s}Row`,
    `flex${s}Column`,
    `flex${s}RowReverse`,
    `flex${s}ColumnReverse`,
    `flex${s}Wrap`,
    `flex${s}Nowrap`,
    `flex${s}WrapReverse`,
    `justifyContent${s}Start`,
    `justifyContent${s}End`,
    `justifyContent${s}Center`,
    `justifyContent${s}Between`,
    `justifyContent${s}Around`,
    `alignItems${s}Start`,
    `alignItems${s}End`,
    `alignItems${s}Center`,
    `alignItems${s}Baseline`,
    `alignItems${s}Stretch`,
    `alignContent${s}Start`,
    `alignContent${s}End`,
    `alignContent${s}Center`,
    `alignContent${s}Between`,
    `alignContent${s}Around`,
    `alignContent${s}Stretch`,
    `alignSelf${s}Auto`,
    `alignSelf${s}Start`,
    `alignSelf${s}End`,
    `alignSelf${s}Center`,
    `alignSelf${s}Baseline`,
    `alignSelf${s}Stretch`,
  ]
}).reduce((acc, val) => acc.concat(val), [])

export default props =>
  sizeClasses.map(sizeClass => {
    const s = (sizeClass === 'xs' ? '' : ucfirst(sizeClass))

    const dNone                 = props[`d${s}None`]
    const dInline               = props[`d${s}Inline`]
    const dInlineBlock          = props[`d${s}InlineBlock`]
    const dBlock                = props[`d${s}Block`]
    const dTable                = props[`d${s}Table`]
    const dTableCell            = props[`d${s}TableCell`]
    const dTableRow             = props[`d${s}TableRow`]
    const dFlex                 = props[`d${s}Flex`]
    const dInlineFlex           = props[`d${s}InlineFlex`]
    const textMonospace         = props[`text${s}Monospace`]
    const textJustify           = props[`text${s}Justify`]
    const textNowrap              = props[`text${s}Nowrap`]
    const textTruncate              = props[`text${s}Truncate`]
    const textLeft              = props[`text${s}Left`]
    const textRight           = props[`text${s}Right`]
    const textCenter           = props[`text${s}Center`]
    const flexRow               = props[`flex${s}Row`]
    const flexColumn            = props[`flex${s}Column`]
    const flexRowReverse        = props[`flex${s}RowReverse`]
    const flexColumnReverse     = props[`flex${s}ColumnReverse`]
    const flexWrap              = props[`flex${s}Wrap`]
    const flexNowrap            = props[`flex${s}Nowrap`]
    const flexWrapReverse       = props[`flex${s}WrapReverse`]
    const justifyContentStart   = props[`justifyContent${s}Start`]
    const justifyContentEnd     = props[`justifyContent${s}End`]
    const justifyContentCenter  = props[`justifyContent${s}Center`]
    const justifyContentBetween = props[`justifyContent${s}Between`]
    const justifyContentAround  = props[`justifyContent${s}Around`]
    const alignItemsStart       = props[`alignItems${s}Start`]
    const alignItemsEnd         = props[`alignItems${s}End`]
    const alignItemsCenter      = props[`alignItems${s}Center`]
    const alignItemsBaseline    = props[`alignItems${s}Baseline`]
    const alignItemsStretch     = props[`alignItems${s}Stretch`]
    const alignContentStart     = props[`alignContent${s}Start`]
    const alignContentEnd       = props[`alignContent${s}End`]
    const alignContentCenter    = props[`alignContent${s}Center`]
    const alignContentBetween   = props[`alignContent${s}Between`]
    const alignContentAround    = props[`alignContent${s}Around`]
    const alignContentStretch   = props[`alignContent${s}Stretch`]
    const alignSelfAuto         = props[`alignSelf${s}Auto`]
    const alignSelfStart        = props[`alignSelf${s}Start`]
    const alignSelfEnd          = props[`alignSelf${s}End`]
    const alignSelfCenter       = props[`alignSelf${s}Center`]
    const alignSelfBaseline     = props[`alignSelf${s}Baseline`]
    const alignSelfStretch      = props[`alignSelf${s}Stretch`]

    return media[sizeClass]`
      ${dNone && css`
        display: none;
      `}

      ${dInline && css`
        display: inline;
      `}

      ${dInlineBlock && css`
        display: inline-block;
      `}

      ${dBlock && css`
        display: block;
      `}

      ${dTable && css`
        display: table;
      `}

      ${dTableCell && css`
        display: table-cell;
      `}

      ${dTableRow && css`
        display: table-row;
      `}

      ${dFlex && css`
        display: flex;
      `}

      ${dInlineFlex && css`
        display: inline-flex;
      `}

      ${textMonospace && css`
        font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      `}

      ${textJustify && css`
        text-align: justify;
      `}

      ${textNowrap && css`
        white-space: nowrap;
      `}

      ${textTruncate && css`
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      `}

      ${textLeft && css`
        text-align: left;
      `}

      ${textRight && css`
        text-align: right;
      `}

      ${textCenter && css`
        text-align: center;
      `}

      ${flexRow && css`
        flex-direction: row;
      `}

      ${flexColumn && css`
        flex-direction: column;
      `}

      ${flexRowReverse && css`
        flex-direction: row-reverse;
      `}

      ${flexColumnReverse && css`
        flex-direction: column-reverse;
      `}

      ${flexWrap && css`
        flex-wrap: wrap;
      `}

      ${flexNowrap && css`
        flex-wrap: nowrap;
      `}

      ${flexWrapReverse && css`
        flex-wrap: wrap-reverse;
      `}

      ${justifyContentStart && css`
        justify-content: flex-start;
      `}

      ${justifyContentEnd && css`
        justify-content: flex-end;
      `}

      ${justifyContentCenter && css`
        justify-content: center;
      `}

      ${justifyContentBetween && css`
        justify-content: space-between;
      `}

      ${justifyContentAround && css`
        justify-content: space-around;
      `}

      ${alignItemsStart && css`
        align-items: flex-start;
      `}

      ${alignItemsEnd && css`
        align-items: flex-end;
      `}

      ${alignItemsCenter && css`
        align-items: center;
      `}

      ${alignItemsBaseline && css`
        align-items: baseline;
      `}

      ${alignItemsStretch && css`
        align-items: stretch;
      `}

      ${alignContentStart && css`
        align-content: flex-start;
      `}

      ${alignContentEnd && css`
        align-content: flex-end;
      `}

      ${alignContentCenter && css`
        align-content: center;
      `}

      ${alignContentBetween && css`
        align-content: space-between;
      `}

      ${alignContentAround && css`
        align-content: space-around;
      `}

      ${alignContentStretch && css`
        align-content: stretch;
      `}

      ${alignSelfAuto && css`
        align-self: auto;
      `}

      ${alignSelfStart && css`
        align-self: flex-start;
      `}

      ${alignSelfEnd && css`
        align-self: flex-end;
      `}

      ${alignSelfCenter && css`
        align-self: center;
      `}

      ${alignSelfBaseline && css`
        align-self: baseline;
      `}

      ${alignSelfStretch && css`
        align-self: stretch;
      `}
    `
  })
