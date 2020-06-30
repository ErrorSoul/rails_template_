import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Route, Switch } from "react-router-dom"
import Forms from "../components/Form"


const Hello = props => (
  <div>Hello {props.name}!</div>
)

Hello.defaultProps = {
  name: 'David'
}

Hello.propTypes = {
  name: PropTypes.string
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <div>
     <Forms/>
     <Hello name="Rea" />
    </div>,
    document.body.appendChild(document.createElement('div')),
  )
})
