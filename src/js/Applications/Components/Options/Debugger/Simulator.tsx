import React, { Component } from "react";
import {Client} from "chomex";

import cn from "classnames";

export default class SimulatorView extends Component<{}, {
  active: {
    tab: string;
    controller: string;
  };
  controllers: {
    message: any[];
    request: any[];
  };
  body: any;
  response?: any;
  error?: any;
}> {

  private client = new Client(chrome.runtime, false);
  constructor(props) {
    super(props);
    this.state = {
      active: {
        tab: "message",
        controller: "ScreenShot",
      },
      controllers: {
        message: [],
        request: [],
      },
      body: {
        "__this": {
          "sender": {}
        },
        "requestBody": {
          "formData": {
            "api_mission_id": [
              0
            ],
            "api_deck_id": [
              2
            ]
          }
        }
      },
      response: null,
      error:    null,
    };
  }
  async componentDidMount() {
    const res = await this.client.message("/debug/availables");
    this.setState({ controllers: res.data.controllers });
  }
  render() {
    const {active, controllers, body} = this.state;
    return (
      <section>
        <h2>Controller Simulator</h2>
        <div className="columns">
          <div className="column col-12">
            <ul className="tab">
              <li className="tab-item">
                <a
                  className={active.tab === "message" ? "active" : null}
                  onClick={() => this.onTab("message")}
                >Message Controllers</a>
              </li>
              <li className="tab-item">
                <a
                  className={active.tab === "request" ? "active" : null}
                  onClick={() => this.onTab("request")}
                >Request Controllers</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="columns">
          <div className="column col-12">
            <div className="form-group">
              <select
                className="form-select"
                onChange={ev => this.onController(ev.target.value)}
                value={active.controller}
              >
                {controllers[active.tab].map((c, i) => {
                  return <option
                    key={i}
                    value={c}>{c}</option>;
                })}
              </select>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column col-6 col-sm-12">
            <h3>{active.tab} body</h3>
            <pre className="code" data-lang="JSON">
              <code
                contentEditable={true}
                suppressContentEditableWarning={true}
                onInput={ev => this.onBodyChange(ev)}>
                {JSON.stringify(body, null, 2)}
              </code>
            </pre>
          </div>
          <div className="column col-6 col-sm-12">
            <h3>response</h3>
            <pre className="code" data-lang="JSON"><code>{this.state.response}</code></pre>
          </div>
        </div>
        <div className="columns">
          <div className="column col-12">
            <button
              className={cn("btn", "btn-primary", "btn-block", { disabled: !!this.state.error })}
              onClick={() => this.execute()}
            >Execute</button>
            <span className="error">{this.state.error}</span>
          </div>
        </div>
      </section>
    );
  }

  // Tabが変わるとき
  onTab(tabname: string) {
    this.setState({
      active: {
        tab: tabname,
        controller: this.state.controllers[tabname][0],
      },
    });
  }

  // Controllerが変わるとき
  onController(name: string) {
    this.setState({
      active: {
        tab: this.state.active.tab,
        controller: this.state.controllers[this.state.active.tab].filter(c => c === name)[0],
      },
    });
  }

  // パラメータボディが変わるとき
  onBodyChange(ev) {
    try {
      const body = JSON.parse(ev.target.innerText);
      this.setState({ body });
    } catch (err) {
      // console.log(err);
    }
  }

  // 選択されているControllerを実行する
  async execute() {
    try {
      const res = await this.client.message("/debug/controller", { ...this.state.body, __controller: this.state.active.controller });
      console.debug(res);
    } catch (err) {
      console.error(err);
    }
  }
}
