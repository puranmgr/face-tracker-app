import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceTracker from './components/FaceTracker/FaceTracker';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank'
import './App.css';

const app = new Clarifai.App({
  apiKey: 'f8c35ba463d94cdbb39b2f75849f4e6f'
});

const particlesOption = {
  particles: {
    line_linked: {
      number: {
        value: 30,
        density: {
          enable: true,
          value_area: 800
        }
      }
    }
  }
}
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin'
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));

  }
  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOption}
        />
        <Navigation />
        {this.state.route === 'signin'
          ? <Signin />
          : <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceTracker box={this.state.box} imageUrl={this.state.imageUrl} />
          </div>
        }
      </div>
    );
  }
}

export default App;
