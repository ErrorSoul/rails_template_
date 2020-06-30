import React from 'react'
import styled, {css} from 'styled-components'
import ucfirst from 'ucfirst'
import media from './media'
import cssHelpers, {cssHelpersProps} from './cssHelpers'

const sizeClasses = ['xs', 'sm', 'md', 'lg', 'xl']

export const Col = styled(({
  auto, autoXs, autoSm, autoMd, autoLg, autoXl,
  xs, sm, md, lg, xl,
  order, orderXs, orderSm, orderMd, orderLg, orderXl,
  offset, offsetXs, offsetSm, offsetMd, offsetLg, offsetXl,
  ...rest
}) => {
  cssHelpersProps.forEach(prop => delete rest[prop])
  return (<div {...rest} />)
})`
  position: relative;
  width: 100%;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;

  ${props => props.eq && css`
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
  `}

  ${props => sizeClasses.map(sizeClass => {
    const s = (sizeClass === 'xs' ? '' : ucfirst(sizeClass))
    const auto = props[`auto${s}`]
    const size = props[sizeClass]
    const order = props[`order${s}`]
    const offset = props[`offset${s}`]

    return media[sizeClass]`
      ${auto && css`
        flex: 0 0 auto;
        width: auto;
        max-width: none;
      `}

      ${size && css`
        flex: 0 0 ${(100 * parseFloat(size) / 12).toFixed(6)}%;
        max-width: ${(100 * parseFloat(size) / 12).toFixed(6)}%;
      `}

      ${order && css`
        order: ${order === 'first' ? -1 : order};
      `}

      ${offset && css`
        margin-left: ${(100 * parseFloat(offset) / 12).toFixed(6)}%;
      `}
    `
  })}

  ${cssHelpers}
`

export const Row = styled(({
  noGutters,
  ...rest
}) => {
  cssHelpersProps.forEach(prop => delete rest[prop])
  return (<div {...rest} />)
})`
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
  ${props => props.noGutters && css`
    margin-right: 0;
    margin-left: 0;

    & > ${Col} {
      padding-right: 0;
      padding-left: 0;
    }
  `}

  ${cssHelpers}
`
