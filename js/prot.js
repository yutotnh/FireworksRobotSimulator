class Robot {
  constructor(number, x, y, direction) {
    this._number = number;
    this._initialPosition = [Number(x), Number(y)];
    this._initialDirection = direction;
    this._move = [];
    this._color = ["Black"];
  }

  get number() {
    return this._number;
  }

  set number(value) {
    this._number = value;
  }

  get initialPositionX() {
    return this._initialPosition[0];
  }

  set initialPositionX(value) {
    this._initialPosition[0] = value;
  }

  get initialPositionY() {
    return this._initialPosition[1];
  }

  set initialPositionY(value) {
    this._initialPosition[1] = value;
  }

  get initialDirection() {
    return this._initialDirection;
  }

  set initialPosition(array) {
    this._initialPosition = array;
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

  getMove(index) {
    return this._move[index];
  }

  setMove(index, move) {
    this._move[index] = move;

    for (let i = 0; i < index; i++) {
      if (this._move[i] == null) this._move[i] = "Stay";
    }
  }

  setColor(turn, color) {
    color = html2color(color);
    color = color2html(color);
    this._color[turn] = color;

    for (let i = 0; i < turn; i++) {
      if (this._color[i] == null) this._color[i] = "Black";
    }
  }

  getColor(turn) {
    if (this._color[turn] == null && turn != 0) {
      this._color[turn] = this._color[turn - 1];
      return this._color[turn];
    } else {
      return this._color[turn];
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
      case null:
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
      case null:
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

  for (let i = 0; i <= height; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j <= width; j++) {
      if (robotExists(turn, j, i) != -1) {
        let index = robotExists(turn, j, i);
        let direction = robot[index].direction(turn).toLowerCase();
        let td = document.createElement("td");
        td.className = "robot_" + direction;
        let id = "robot" + index;
        td.id = id;
        td.innerHTML = robot[index].number;
        td.style.backgroundColor = robot[index].getColor(turn);
        index++;
        tr.appendChild(td);
      } else if (robotExists(turn + 1, j, i) != -1) {
        let index = robotExists(turn + 1, j, i);
        let direction = robot[index].direction(turn + 1).toLowerCase();
        let td = document.createElement("td");
        td.className = "next_robot_" + direction;
        let id = "next_robot" + index;
        td.id = id;
        td.innerHTML = robot[index].number;
        // td.style.backgroundColor = robot[robotNumber].getColor(turn + 1);
        index++;
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

  console.log(robot);

  setContextMenu();

  // collision_check();
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

  for (let i = 0; i < robot.length; i++) {
    if (turn == 0) {
      break;
    }

    if (turn == 1) {
      if (
        robot[i].getMove(turn) == null ||
        robot[i].getMove(turn) == undefined
      ) {
        robot[i].setMove(turn, robot[i].initialDirection);
      }
    } else {
      if (
        robot[i].getMove(turn) == null ||
        robot[i].getMove(turn) == undefined
      ) {
        robot[i].setMove(turn, robot[i].getMove(turn - 1));
      }
    }
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
              "設定したい色を教えてください。(例：Red, Green, Blue, #F0F0F0,...)"
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
            {
              text: "停止",
              action: function () {
                robot[i].setMove(turn, "Stay");
                drawField();
              },
            },
          ],
        },
        {
          text: "削除",
          action: function () {
            if (
              window.confirm(
                "ロボット" + robot[i].number + "を本当に削除しますか？"
              )
            ) {
              robot.splice(i, 1);
              console.log("削除: %d", robot[i].number);
              drawField();
            }
          },
        },
        {
          text: "始めの向き",
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
        {
          text: "初期位置の変更",
          action: function () {
            console.log("変更%d", i);
            changeRobotPlace(i);
            drawField();
          },
        },
        {
          text: "番号",
          action: function () {
            let str = window.prompt("設定したい番号を教えてください。");
            if (Number(str)) {
              let prevNumber = robot[i].number;
              robot[i].number = Number(str);
              for (let j = 0; j < robot.length; j++) {
                if (i != j) {
                  if (Number(str) == robot[j].number)
                    robot[i].number = prevNumber;
                }
              }
            }
            drawField();
          },
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
  //             robot[robot.length] = new Robot(j, i, "Up");
  //             drawField();
  //           },
  //         },
  //       ],
  //     });
  //   }
  // }
}

function collision_check() {
  console.log("衝突検知開始");
  for (let turn = 1; turn <= 60; turn++) {
    for (let x = 1; x <= 13; x++) {
      for (let y = 1; y <= 12; y++) {
        let prev = robotExists(turn - 1, x, y);
        let current = robotExists(turn, x, y);

        if (prev != -1 && current != -1) {
          if (prev != current) {
            console.log("衝突の可能性あり: turn %d, x:%d, y:%d", turn, x, y);
          }
        }
      }
    }
  }
}

function robotExists(turn, x, y) {
  let exists = [];
  for (let i = 0; i < robot.length; i++) {
    let position = robot[i].position(turn);
    if (position[0] == x && position[1] == y) exists.push(i);
  }

  if (exists.length == 1) return exists[0];
  else if (exists.length == 0) return -1;
  else {
    let str = "";
    for (let i = 0; i <= exists.length; i++) {
      str += exists[i] + ", ";
    }
    str += "が衝突しました";
    alert(str);
    return exists[0];
  }
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
        let number_array = [];
        robot.forEach((element) => {
          number_array.push(element.number);
        });

        number_array = number_array.sort(function (a, b) {
          return a < b ? -1 : 1;
        });

        let number = 1;
        number_array.forEach((element) => {
          if (number == element) number++;
        });
        robot[robot.length] = new Robot(number, inputX, inputY, "Up");
        drawField();
      }
    }
  }
}

function changeRobotPlace(number) {
  let str = window.prompt("変更後のロボットの座標を入力してください(例：5,8)");
  if (str == null) return;
  str = str.split(",");
  if (str.length == 2) {
    let inputX = Number(str[0]);
    let inputY = Number(str[1]);

    if (1 <= inputX && inputX <= width && 1 <= inputY && inputY <= height) {
      if (robotExists(turn, inputX, inputY) == -1) {
        robot[number].initialPositionX = inputX;
        robot[number].initialPositionY = inputY;
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
  // originalDataに，種々のデータが格納されているとする。次は一例。
  let originalData = {
    field_x: width,
    field_y: height,
    robot: [],
  };

  // console.log(originalData);

  for (let i = 0; i < robot.length; i++) {
    originalData.robot[i] = {};
    originalData.robot[i].number = robot[i].number;
    originalData.robot[i].initialX = robot[i].initialPositionX;
    originalData.robot[i].initialY = robot[i].initialPositionY;
    originalData.robot[i].initialDirection = robot[i].initialDirection;
    let move = robot[i].move;
    for (let i = 0; i < move.length; i++) {
      if (move[i] == null) move[i] = "Stay";
    }
    originalData.robot[i].move = move;

    let color = [];

    for (let j = 0; j < robot[i].color.length; j++) {
      if (robot[i].color[j] == null) color[j] = "Black";
      color[j] = html2color(robot[i].color[j]);
    }

    originalData.robot[i].color = color;
  }

  // データをJSON形式の文字列に変換する。
  const data = JSON.stringify(originalData);

  // HTMLのリンク要素を生成する。
  const link = document.createElement("a");

  // リンク先にJSON形式の文字列データを置いておく。
  link.href = "data:text/plain," + encodeURIComponent(data);

  // 保存するJSONファイルの名前をリンクに設定する。
  link.download = "default.json";

  // ファイルを保存する。
  link.click();
  link.remove();
}

function analysisJSON(file) {
  file = JSON.parse(file);
  document.getElementById("field-width-value").value = file.field_x;
  document.getElementById("field-height-value").value = file.field_y;

  document.getElementById("number-of-robots").innerHTML =
    file.robot.length + "台";

  robot = [];

  for (let i = 0; i < file.robot.length; i++) {
    robot[i] = new Robot(
      file.robot[i].number,
      file.robot[i].initialX,
      file.robot[i].initialY,
      file.robot[i].initialDirection
    );
    robot[i].move = file.robot[i].move;
    let color = [];
    for (let j = 0; j < file.robot[i].color.length; j++) {
      color[j] = color2html(file.robot[i].color[j]);
    }
    robot[i].color = color;
  }
  drawField();

  return robot;
}

function handleFiles() {
  const fileList = this.files;
  /* ファイルリストを処理するコードがここに入る */
  let reader = new FileReader();
  reader.readAsText(fileList[0]);
  reader.onload = function (event) {
    analysisJSON(event.target.result);
  };

  reader.onerror = function () {
    alert("エラー：ファイルをロードできません。");
  };

  return robot;
}

function html2color(str) {
  var canvas = document.getElementById("my-canvas");
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = str;
  ctx.strokeStyle = str;
  ctx.rect(0, 0, 1, 1);
  ctx.fill();
  ctx.stroke();
  var imagedata = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

  var r = imagedata.data[0]; //. R(0-255)
  var g = imagedata.data[1]; //. G(0-255)
  var b = imagedata.data[2]; //. B(0-255)
  var a = imagedata.data[3]; //. 輝度(0-255)

  return [r, g, b];
}

function color2html(color) {
  let r = color[0].toString(16);
  if (r.length == 1) r = "0" + color[0].toString(16);

  let g = color[1].toString(16);
  if (g.length == 1) g = "0" + color[1].toString(16);

  let b = color[2].toString(16);
  if (b.length == 1) b = "0" + color[2].toString(16);

  return "#" + r + g + b;
}
