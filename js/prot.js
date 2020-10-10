class Robot {
  constructor(x, y, direction, color) {
    this._initialPosition = [Number(x), Number(y, 10)];
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

  setMove(index, move) {
    this._move[index] = move;
  }

  setColor(index, color) {
    this._color[index] = color;
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

function createTable(width, height, turn) {
  let table = document.createElement("table");
  table.setAttribute("class", "field");
  table.setAttribute("id", "field");

  let dataPath = "csv/sample.csv";
  let robots = [];

  let request = new XMLHttpRequest(); // HTTPでファイルを読み込む
  request.addEventListener("load", (event) => {
    // ロードさせ実行
    console.log("Load CSV.");
    const str = event.target.responseText; // 受け取ったテキストを返す
    // 最終的な二次元配列を入れるための配列
    var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成

    // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
    for (var i = 1; i < tmp.length - 1; i++) {
      let str = [];
      str[i] = tmp[i].split(",");
      robots[i - 1] = new Robot(str[i][1], str[i][2], str[i][3], str[i][4]);
      let index = 0;
      for (var j = 5; j < str[i].length; j += 2) {
        robots[i - 1].setMove(index, str[i][j]);
        robots[i - 1].setColor(index, str[i][j + 1]);
        index++;
      }
    }

    console.log(robots);

    for (let i = 0; i <= height; i++) {
      let tr = document.createElement("tr");
      for (let j = 0; j <= width; j++) {
        if (robotExists(robots, turn, j, i) != -1) {
          let robotNumber = robotExists(robots, turn, j, i);
          let direction = robots[robotNumber].direction(turn).toLowerCase();
          let td = document.createElement("td");
          td.className = "robot_" + direction;
          let id = "robot" + robotNumber;
          td.id = id;
          td.innerHTML = robotNumber;
          robotNumber++;
          tr.appendChild(td);
        } else if (robotExists(robots, turn + 1, j, i) != -1) {
          let robotNumber = robotExists(robots, turn + 1, j, i);
          let direction = robots[robotNumber].direction(turn + 1).toLowerCase();
          let td = document.createElement("td");
          td.className = "next_robot_" + direction;
          let id = "robot" + robotNumber;
          td.id = id;
          td.innerHTML = robotNumber;
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
          } else if (j == width) {
            td.className = "cross_upper_right";
          } else {
            td.className = "cross_upper_middle";
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
          } else if (j == width) {
            td.className = "cross_lower_right";
          } else {
            td.className = "cross_lower_middle";
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
          } else {
            td.className = "cross_middle";
          }
          tr.appendChild(td);
        }
      }
      table.appendChild(tr);
    }
    document.getElementById("field-table").appendChild(table);

    for (let i = 0; i < robots.length; i++) {
      let id = "robot" + i;
      let elem = document.getElementById(id);
      if (elem != null) {
        elem.addEventListener(
          "mouseover",
          function (event) {
            event.target.style.backgroundColor = "black";
            console.log("MouseOver");
            setTimeout(function () {
              event.target.style.backgroundColor = "";
            }, 500);
          },
          false
        );
      }
    }
  });
  console.log("%s", dataPath);
  request.open("GET", dataPath, true); // csvのパスを指定
  request.send();
}

function drawField() {
  let field = document.getElementById("field");
  if (field != null) field.remove();

  let turn = Number(document.getElementById("turn-value").value);
  let x = Number(document.getElementById("field-width-value").value);
  let y = Number(document.getElementById("field-height-value").value);

  if (turn < 0) {
    turn = document.getElementById("turn-value").value = 0;
  } else if (turn > 1000) {
    turn = document.getElementById("turn-value").value = 1000;
  }

  if (x < 2) {
    x = document.getElementById("field-width-value").value = 2;
  } else if (x > 100) {
    x = document.getElementById("field-width-value").value = 100;
  }

  if (y < 2) {
    y = document.getElementById("field-height-value").value = 2;
  } else if (y > 100) {
    y = document.getElementById("field-height-value").value = 100;
  }

  createTable(x, y, turn);
  // setRobots("csv/sample.csv", 0);
}

function setRobots(dataPath, tern) {
  let robots = [];

  let request = new XMLHttpRequest(); // HTTPでファイルを読み込む
  request.addEventListener("load", (event) => {
    // ロードさせ実行
    console.log("Load CSV.");
    const str = event.target.responseText; // 受け取ったテキストを返す
    // 最終的な二次元配列を入れるための配列
    var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成

    // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
    for (var i = 1; i < tmp.length; i++) {
      let str = [];
      str[i] = tmp[i].split(",");
      robots[i - 1] = new Robot(str[i][1], str[i][2], str[i][3]);
      for (var j = 4; j < str[i].length; ++j) {}
    }

    console.log(robots);
  });
  console.log("%s", dataPath);
  request.open("GET", dataPath, true); // csvのパスを指定
  request.send();

  return robots;
}

function robotExists(robots, turn, x, y) {
  for (let i = 0; i < robots.length; i++) {
    let position = robots[i].position(turn);
    // console.log("%d-%d, %d-%d", position[0], x, position[1], y);
    if (position[0] == x && position[1] == y) return i;
  }
  return -1;
}

function addRobot() {
  let str = window.prompt("入力してね");
  str = str.split(",");
  if (str.length == 2) {
    let x = Number(str[0]);
    let y = Number(str[1]);
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
