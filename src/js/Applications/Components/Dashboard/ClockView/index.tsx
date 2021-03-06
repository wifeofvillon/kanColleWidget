import React from "react";
import { Client } from "chomex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnchor, faCamera } from "@fortawesome/free-solid-svg-icons";

import NotificationSetting from "../../../Models/Settings/NotificationSetting";

export default class ClockView extends React.Component<{
  now: Date;
  gameWindowExists: Boolean;
}> {

  private client: Client = new Client(chrome.runtime, false);

  private getDayOfWeek(): string {
    const dict = {
      0: "日",
      1: "月",
      2: "火",
      3: "水",
      4: "木",
      5: "金",
      6: "土",
    };
    return dict[this.props.now.getDay()];
  }

  render(): JSX.Element {
    const { now, gameWindowExists } = this.props;
    return (
      <div className="icon-clock-container row">
        <div className="icon-wrapper">{this.renderIcon(gameWindowExists)}</div>
        <div className="clock-wrapper cell">
          <div className="date-wrapper">
            <div className="month">
              <span>{now.getMonth() + 1}</span>
              <span>月</span>
            </div>
            <div className="date">
              <span>{now.getDate()}</span>
              <span>日</span>
            </div>
            <div className="day-of-week">
              <span>{this.getDayOfWeek()}</span>
              <span>曜日</span>
            </div>
          </div>
          <div className="time-wrapper">
            <div className="hours"><span>{now.getHours().pad(2)}</span></div>
            <div className="colon"><span>:</span></div>
            <div className="minute"><span>{now.getMinutes().pad(2)}</span></div>
            {/* TODO: #1150がmergeされたらrenderIconの中にもっていく */}
            <div className="second"><span>{now.getSeconds().pad(2)}</span></div>
          </div>
        </div>
      </div>
    );
  }

  renderIcon(gameWindowExists) {
    const setting: NotificationSetting = NotificationSetting.find("default");
    // ユーザー指定のアイコンを優先
    if (setting.icon) return <figure className="avatar avatar-xl" onClick={this.onClickIcon.bind(this)}><img src={setting.icon} /></figure>;
    // ウィンドウが開かれていたらカメラ、それ以外は錨
    const icon = gameWindowExists ? faCamera : faAnchor;
    return (
      <figure className="avatar avatar-xl bg-secondary" onClick={this.onClickIcon.bind(this)}>
        <FontAwesomeIcon icon={icon} />
      </figure>
    );
  }

  onClickIcon() {
    this.client.message("/window/action");
  }
}