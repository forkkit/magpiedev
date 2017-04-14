
Hey! Here is a simple React toggle switch component that can be used for any mobile inspired website, or hybrid app.

<div class="spacer h25"></div>

## The React

This Component only requires one state key for the toggle, aptly named `toggle`.

First, add the imports and the DOM render node:

```js
import React from 'react'
import ReactDOM from 'react-dom'

// Component will go here.

ReactDOM.render(<Toggle />, document.getElementById('root'))

```

Now, create a class extending the React Component and insert it where our prior comment was:


```js

class Toggle extends React.Component {
  state = {
    toggle: false
  }

  toggle () {
    this.setState({ toggle: !this.state.toggle })
  }
}
```

To continue, we will add the JSX for the actual DOM elements in the render function:
The className will add the `toggle` class when the toggle is active.

```js
render () {
  const className = `toggle-component ${ this.state.toggle ? ' active' : ''}`
  return (
    <div
      className={className}
      onClick={() => this.toggle()}>
      <div className='toggle-button' />
    </div>
  )
}
```

## The CSS

```css
.wrapper {
  padding: 50px;
}

.toggle-component {
  font-size: 2rem;
  color: #171717;
  width: 50px;
  height: 20px;
  background: #777777;
  border: 1px solid #555;
  position: relative;
  border-radius: 10px;
  cursor: pointer;
  transition: border-color background-color 0.3s;
}
.toggle-component.active {
  background: #66CC99;
  border-color: #dfdfdf;
}
.toggle-component.active .toggle-button {
  right: -2px;
}
.toggle-component .toggle-button {
  position: absolute;
  top: -3px;
  right: 50%;
  height: 26px;
  width: 26px;
  background: #dfdfdf;
  box-shadow: 0 0 5px #555;
  border-radius: 50%;
  transition: right 0.3s;
}
```


## JSFiddle Demo
All together now:

<div class='spacer'></div>
<iframe width="100%" height="300" src="//jsfiddle.net/stevelacy/tnp9m9zc/9/embedded/result,js,css" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


