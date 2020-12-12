import { init, view } from "./App.js";

// React framework
const e = React.createElement;

class App extends React.Component {
  constructor(props) {
    super(props);

    const [model, cmd = none] = init(this.msg());
    this.state = model;

    cmd(this.msg());
  }

  render() {
    return view({ model: this.state, msg: this.msg() });
  }

  update([f, args]) {
    // console.log(f.name, args);
    const [model, cmd = none] = f(this.state, args);
    // console.log("->", snapshot(model));

    this.setState(model);

    cmd(this.msg());
  }

  msg() {
    return ([f, args]) => {
      this.update([f, args]);
    };
  }
}

const domContainer = document.querySelector("#app");
ReactDOM.render(e(App), domContainer);

function _log(v) {
  console.log(v);
  return v;
}
function none() {}

function snapshot(model) {
  try {
    return JSON.parse(JSON.stringify(model));
  } catch (e) {
    return { model };
  }
}