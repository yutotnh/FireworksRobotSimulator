class Robot {
  constructor(x, y, direction, color) {
    this._initialPosition = [Number(x), Number(y)];
    this._initialDirection = direction;
    this._initialColor = color;
    this._move = [];
    this._color = [];
  }

  get initialPositionX() {
    return this._initialPosition[0];
  }

  get initialPositionY() {
    return this._initialPosition[1];
  }

  get initialColor() {
    return this._initialColor;
  }

  get initialDirection() {
    return this._initialDirection;
  }

  get move() {
    return this._move;
  }

  get color() {
    return this._color;
  }

  set move(array) {
    this._move = array;
  }

  set initialDirection(direction) {
    this._initialDirection = direction;
  }

  set color(array) {
    this._color = array;
  }

  setMove(index, move) {
    this._move[index] = move;
  }

  setColor(turn, color) {
    if (turn == 0) this._initialColor = color;
    else this._color[turn - 1] = color;
  }

  getColor(turn) {
    if (turn == 0) {
      return this._initialColor;
    } else {
      if (turn > this._color.length) return this._color[this._color.length - 1];
      else return this._color[turn - 1];
    }
  }

  direction(turn) {
    // フィールドから見た向き（絶対的）
    let direction = this.directionToNumber(this._initialDirection) - 1;
    for (let i = 0; i < turn; i++) {
      switch (this.move[i]) {
        case "Up":
          break;
        case "Left":
          direction += 1;
          break;
        case "Down":
          break;
        case "Right":
          direction += 3;
          break;
        case "Stay":
          break;
        default:
          break;
      }
    }
    direction %= 4;
    return this.numberToDirection(direction + 1);
  }

  position(turn) {
    let position = [this.initialPositionX, this.initialPositionY];

    for (let i = 0; i < turn && i < this._move.length; i++) {
      if (this._move[i] != "Stay") {
        switch (this.directionToNumber(this.direction(i + 1)) - 1) {
          case 0:
            if (this._move[i] == "Down") position[1]++;
            else position[1]--;
            break;
          case 1:
            if (this._move[i] == "Down") position[0]++;
            else position[0]--;
            break;
          case 2:
            if (this._move[i] == "Down") position[1]--;
            else position[1]++;
            break;
          case 3:
            if (this._move[i] == "Down") position[0]--;
            else position[0]++;
        }
      }
    }
    return position;
  }

  directionToNumber(direction) {
    switch (direction) {
      case "Up":
        return 1;
      case "Left":
        return 2;
      case "Down":
        return 3;
      case "Right":
        return 4;
      case "Stay":
        return 0;
      default:
        return -1;
    }
  }

  numberToDirection(value) {
    switch (value) {
      case 1:
        return "Up";
      case 2:
        return "Left";
      case 3:
        return "Down";
      case 4:
        return "Right";
      case 0:
        return "Stay";
      default:
        return -1;
    }
  }
}

function createTable() {
  let table = document.createElement("table");
  table.setAttribute("class", "field");
  table.setAttribute("id", "field");

  console.log(robot);

  for (let i = 0; i <= height; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j <= width; j++) {
      if (robotExists(turn, j, i) != -1) {
        let robotNumber = robotExists(turn, j, i);
        let direction = robot[robotNumber].direction(turn).toLowerCase();
        let td = document.createElement("td");
        td.className = "robot_" + direction;
        let id = "robot" + robotNumber;
        td.id = id;
        td.innerHTML = robotNumber;
        td.style.backgroundColor = robot[robotNumber].getColor(turn);
        robotNumber++;
        tr.appendChild(td);
      } else if (robotExists(turn + 1, j, i) != -1) {
        let robotNumber = robotExists(turn + 1, j, i);
        let direction = robot[robotNumber].direction(turn + 1).toLowerCase();
        let td = document.createElement("td");
        td.className = "next_robot_" + direction;
        let id = "next_robot" + robotNumber;
        td.id = id;
        td.innerHTML = robotNumber;
        // td.style.backgroundColor = robot[robotNumber].getColor(turn + 1);
        robotNumber++;
        tr.appendChild(td);
      } else if (i == 0) {
        // 1行目のtr要素の時
        let th = document.createElement("th");
        th.textContent = j;
        th.className = "row_number";
        tr.appendChild(th);
      } else if (i == 1) {
        let td = document.createElement("td");
        if (j == 0) {
          td.className = "column_number";
          td.textContent = i;
        } else if (j == 1) {
          td.className = "cross_upper_left";
          td.id = "field" + j + "-" + i;
        } else if (j == width) {
          td.className = "cross_upper_right";
          td.id = "field" + j + "-" + i;
        } else {
          td.className = "cross_upper_middle";
          td.id = "field" + j + "-" + i;
        }
        tr.appendChild(td);
      } else if (i == height) {
        // 最終行のtr要素の時
        let td = document.createElement("td");
        if (j == 0) {
          td.className = "column_number";
          td.textContent = i;
        } else if (j == 1) {
          td.className = "cross_lower_left";
          td.id = "field" + j + "-" + i;
        } else if (j == width) {
          td.className = "cross_lower_right";
          td.id = "field" + j + "-" + i;
        } else {
          td.className = "cross_lower_middle";
          td.id = "field" + j + "-" + i;
        }
        tr.appendChild(td);
      } else {
        // 間の行のtr要素の時
        let td = document.createElement("td");
        if (j == 0) {
          td.className = "column_number";
          td.textContent = i;
        } else if (j == 1) {
          td.className = "cross_middle_left";
          td.id = "field" + j + "-" + i;
        } else if (j == width) {
          td.className = "cross_middle_right";
          td.id = "field" + j + "-" + i;
        } else {
          td.className = "cross_middle";
          td.id = "field" + j + "-" + i;
        }
        tr.appendChild(td);
      }
    }
    table.appendChild(tr);
  }
  document.getElementById("field-table").appendChild(table);

  setContextMenu();
}

function drawField() {
  let field = document.getElementById("field");
  if (field != null) field.remove();

  turn = Number(document.getElementById("turn-value").value);
  width = Number(document.getElementById("field-width-value").value);
  height = Number(document.getElementById("field-height-value").value);

  if (turn < 0) {
    turn = document.getElementById("turn-value").value = 0;
  } else if (turn > 1000) {
    turn = document.getElementById("turn-value").value = 1000;
  }

  if (width < 2) {
    width = document.getElementById("field-width-value").value = 2;
  } else if (width > 100) {
    width = document.getElementById("field-width-value").value = 100;
  }

  if (height < 2) {
    height = document.getElementById("field-height-value").value = 2;
  } else if (height > 100) {
    height = document.getElementById("field-height-value").value = 100;
  }

  createTable();
}

function setContextMenu() {
  contextMenuObj.length = 0;
  for (let i = 0; i < robot.length; i++) {
    var sampleElement = document.getElementById("robot" + i);
    if (sampleElement == null) break;
    contextMenuObj[contextMenuObj.length] = new ContextMenu({
      element: sampleElement,
      menuList: [
        {
          text: "色",
          action: function () {
            let str = window.prompt(
              "設定したい色を教えてください。(例：Red, Green, Blue,...)"
            );
            if (str.length != 0) robot[i].setColor(turn, str);
            drawField();
          },
        },
        {
          text: "移動",
          // action: function () {},
          subMenu: [
            {
              text: "直進",
              action: function () {
                console.log(i);
                robot[i].setMove(turn, "Up");
                drawField();
              },
            },
            {
              text: "右折",
              action: function () {
                robot[i].setMove(turn, "Right");
                drawField();
              },
            },
            {
              text: "左折",
              action: function () {
                robot[i].setMove(turn, "Left");
                drawField();
              },
            },
            {
              text: "後進",
              action: function () {
                robot[i].setMove(turn, "Down");
                drawField();
              },
            },
          ],
        },
        {
          text: "削除",
          action: function () {
            robot.splice(i, 1);
            console.log("削除: %d", i);
            drawField();
          },
        },
        {
          text: "向き",
          action: function () {},
          subMenu: [
            {
              text: "上",
              action: function () {
                if (turn == 0) {
                  robot[i].initialDirection = "Up";
                  drawField();
                }
              },
            },
            {
              text: "右",
              action: function () {
                if (turn == 0) {
                  robot[i].initialDirection = "Right";
                  drawField();
                }
              },
            },
            {
              text: "左",
              action: function () {
                if (turn == 0) {
                  robot[i].initialDirection = "Left";
                  drawField();
                }
              },
            },
            {
              text: "下",
              action: function () {
                if (turn == 0) {
                  robot[i].initialDirection = "Down";
                  drawField();
                }
              },
            },
          ],
        },
      ],
    });
  }

  // for (let i = 1; i <= height; i++) {
  //   for (let j = 1; j <= width; j++) {
  //     var sampleElement = document.getElementById("field" + j + "-" + i);
  //     if (sampleElement == null) {
  //       break;
  //     }
  //     contextMenuObj[contextMenuObj.length] = new ContextMenu({
  //       element: sampleElement,
  //       menuList: [
  //         {
  //           text: "追加",
  //           action: function () {
  //             robot[robot.length] = new Robot(j, i, "Up", "White");
  //             drawField();
  //           },
  //         },
  //       ],
  //     });
  //   }
  // }
}

// function placeRobot(turn) {
//   for (let i = 0; i < robot.length; i++) {
//     let position = robot[i].position(turn);
//     console.log("field" + position[0] + "-" + position[1]);
//     let element = document.getElementById(
//       "field" + position[0] + "-" + position[1]
//     );
//     element.id = "robot" + i;
//     let direction = robot[robotNumber].direction(turn).toLowerCase();
//     element.className = "robot_" + direction;
//     element.innerHTML = robotNumber;
//   }

//   for (let i = 0; i < robot.length; i++) {
//     let position = robot[i].position(turn);
//     let tmp = document.getElementById(
//       "field" + position[0] + "-" + position[1]
//     );
//     tmp.id = "next-robot" + i;
//     let direction = robot[robotNumber].direction(turn).toLowerCase();
//     tmp.className = "next_robot_" + direction;
//     tmp.innerHTML = robotNumber;
//   }
// }

function robotExists(turn, x, y) {
  for (let i = 0; i < robot.length; i++) {
    let position = robot[i].position(turn);
    // console.log("%d-%d, %d-%d", position[0], x, position[1], y);
    if (position[0] == x && position[1] == y) return i;
  }
  return -1;
}

function addRobot() {
  let str = window.prompt("追加するロボットの座標を入力してください(例：5,8)");
  if (str == null) return;
  str = str.split(",");
  if (str.length == 2) {
    let inputX = Number(str[0]);
    let inputY = Number(str[1]);
    if (1 <= inputX && inputX <= width && 1 <= inputY && inputY <= height) {
      if (robotExists(turn, inputX, inputY) == -1) {
        robot[robot.length] = new Robot(inputX, inputY, "Up", "White");
        drawField();
      }
    }
  }
}

function directionToNumber(direction) {
  switch (direction) {
    case "Up":
      return 1;
    case "Left":
      return 2;
    case "Down":
      return 3;
    case "Right":
      return 4;
    case "Stay":
      return 0;
    default:
      return -1;
  }
}

function saveJSON() {
  let fileName = window.prompt("保存するファイル名を指定してください");

  if (fileName == null) {
    return;
  }

  if (fileName.indexOf(".json", 0) == -1) {
    fileName += ".json";
    console.log(fileName);
  }

  // originalDataに，種々のデータが格納されているとする。次は一例。
  originalData = {
    field_x: width,
    field_y: height,
    robot: [],
  };

  console.log(originalData);

  for (let i = 0; i < robot.length; i++) {
    originalData.robot[i] = {};
    originalData.robot[i].initialX = robot[i].initialPositionX;
    originalData.robot[i].initialY = robot[i].initialPositionY;
    originalData.robot[i].initialDirection = robot[i].initialDirection;
    originalData.robot[i].initialColor = robot[i].initialColor;
    originalData.robot[i].move = robot[i].move;
    originalData.robot[i].color = robot[i].color;
  }

  // データをJSON形式の文字列に変換する。
  const data = JSON.stringify(originalData);

  // HTMLのリンク要素を生成する。
  const link = document.createElement("a");

  // リンク先にJSON形式の文字列データを置いておく。
  link.href = "data:text/plain," + encodeURIComponent(data);

  // 保存するJSONファイルの名前をリンクに設定する。
  link.download = fileName;

  // ファイルを保存する。
  link.click();
}

function readJSON(path) {
  let xhr = new XMLHttpRequest();
  let robot = [];

  xhr.onload = () => {
    let responseJson = JSON.parse(xhr.response);

    document.getElementById("field-width-value").value = responseJson.field_x;
    document.getElementById("field-height-value").value = responseJson.field_y;

    document.getElementById("number-of-robots").innerHTML =
      responseJson.robot.length + "台";

    for (let i = 0; i < responseJson.robot.length; i++) {
      robot[i] = new Robot(
        responseJson.robot[i].initialX,
        responseJson.robot[i].initialY,
        responseJson.robot[i].initialDirection,
        responseJson.robot[i].initialColor
      );
      robot[i].move = responseJson.robot[i].move;
      robot[i].color = responseJson.robot[i].color;
    }
    drawField();
  };
  xhr.open("GET", path, true);
  xhr.send();

  return robot;
}
