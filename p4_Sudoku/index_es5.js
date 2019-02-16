"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class Board 9x9数独矩阵
 */
var Board =
/*#__PURE__*/
function () {
  //构造函数生成空白的9x9数独格子
  function Board() {
    _classCallCheck(this, Board);

    var cells = [];

    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        cells[i * 9 + j] = new Cell(i + 1, j + 1, 0);
      }
    }

    ;
    this.cells = cells;
    this.focusLocation = [0, 0];
    this.dom = null;
  } //初始化数独矩阵，生成完整的符合数独规则的表格


  _createClass(Board, [{
    key: "init",
    value: function init() {
      var row = 1;

      while (row <= 9) {
        row = Tools.fillRow(this, row);
      }

      ;
    } //获取当前数独的81个格子列表

  }, {
    key: "getCells",
    value: function getCells() {
      return this.cells;
    }
    /**
     * 获取指定矩形范围的格子列表
     * @param {number} startRow 开始行数-含
     * @param {number} startCol 开始列数-含
     * @param {number} endRow 结束行数-含
     * @param {number} endCol 结束列数-含
     * @param {boolean} onlyValue 返回格子的值，默认false返回格子对象
     * @returns {array} 指定范围的格子/格子值列表
     */

  }, {
    key: "getRangeList",
    value: function getRangeList(startRow, startCol, endRow, endCol) {
      var onlyValue = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var rangeList = this.cells.filter(function (item) {
        var _item$getLocation = item.getLocation(),
            _item$getLocation2 = _slicedToArray(_item$getLocation, 2),
            cellRow = _item$getLocation2[0],
            cellCol = _item$getLocation2[1];

        var isContainRow = cellRow >= startRow && cellRow <= endRow,
            isContainCol = cellCol >= startCol && cellCol <= endCol;
        return isContainRow && isContainCol;
      });
      return onlyValue ? Tools.getValueList(rangeList) : rangeList;
    } //获取指定坐标的格子对象

  }, {
    key: "getSingleCell",
    value: function getSingleCell(row, col) {
      return this.getRangeList(row, col, row, col)[0];
    } //获取指定行的9个格子列表

  }, {
    key: "getRowList",
    value: function getRowList(row) {
      return this.getRangeList(row, 1, row, 9);
    } //获取指定列的9个格子列表

  }, {
    key: "getColList",
    value: function getColList(col) {
      return this.getRangeList(1, col, 9, col);
    } //获取指定坐标的格子所在3x3区块的9个格子列表

  }, {
    key: "getSqureList",
    value: function getSqureList(row, col) {
      var bigRow = parseInt((row - 1) / 3) + 1,
          rowTop = bigRow * 3,
          rowBottom = rowTop - 2,
          bigCol = parseInt((col - 1) / 3) + 1,
          colTop = bigCol * 3,
          colBottom = colTop - 2;
      return this.getRangeList(rowBottom, colBottom, rowTop, colTop);
    }
    /**
     * 批量设置指定矩形范围格子的值
     * @param {number} startRow 开始行数-含
     * @param {number} startCol 开始列数-含
     * @param {number} endRow 结束行数-含
     * @param {number} endCol 结束列数-含
     * @param {number} value 格子的值，默认0
     * @returns {array} 指定范围的格子列表
     */

  }, {
    key: "setRangeList",
    value: function setRangeList(startRow, startCol, endRow, endCol) {
      var value = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var list = this.getRangeList(startRow, startCol, endRow, endCol, false);
      list.forEach(function (item) {
        item.setValue(value);
      });
      return list;
    }
    /**
     * 设置指定坐标格子的值
     * @param {number} row 行坐标
     * @param {number} col 列坐标
     * @param {number} val 要设置的值
     * @returns {object} 返回指定的格子对象
     */

  }, {
    key: "setSingleCell",
    value: function setSingleCell(row, col, val) {
      return this.setRangeList(row, col, row, col, val)[0];
    }
    /**
     * 清楚指定矩形范围格子的值和数字使用记录
     * @param {number} startRow 开始行数-含
     * @param {number} startCol 开始列数-含
     * @param {number} endRow 结束行数-含
     * @param {number} endCol 结束列数-含
     */

  }, {
    key: "clearRangeList",
    value: function clearRangeList(startRow, startCol, endRow, endCol) {
      var list = this.setRangeList(startRow, startCol, endRow, endCol, 0);
      list.forEach(function (cell) {
        cell.used.clearUsed();
      });
    }
  }, {
    key: "digSingleCell",
    value: function digSingleCell(row, col) {
      var cell = this.getSingleCell(row, col);
      cell.setDigStatus(true);
      return cell;
    }
  }, {
    key: "setFocusLocation",
    value: function setFocusLocation(row, col) {
      var _this$focusLocation = _slicedToArray(this.focusLocation, 2),
          lastRow = _this$focusLocation[0],
          lastCol = _this$focusLocation[1];

      var lastCell = this.getSingleCell(lastRow, lastCol);
      this.focusLocation = [row, col];

      if (lastCell) {
        lastCell.toggleFocus();
        this.updateCellDom(lastRow, lastCol);
      }

      ;
    }
  }, {
    key: "handleInputFocus",
    value: function handleInputFocus(row, col) {
      var cell = this.getSingleCell(row, col);

      if (cell.getDigStatus()) {
        cell.toggleFocus();
        this.setFocusLocation(row, col);
        this.updateCellDom(row, col);
      }
    }
  }, {
    key: "handleUserInput",
    value: function handleUserInput(val) {
      var _this$focusLocation2 = _slicedToArray(this.focusLocation, 2),
          row = _this$focusLocation2[0],
          col = _this$focusLocation2[1];

      var cell = this.getSingleCell(row, col);
      if (!cell) return;
      var validList = Tools.getValidNums(row, col, this, true);
      val = Number(val);

      if (validList.includes(val)) {
        //暂时有效
        console.log('数字有效');
        cell.setInputValid(true);

        if (this.checkAllDone()) {
          alert('恭喜过关');
        } else {// this.handleInputFocus(...this.getNextDigCell(row, col));
        }
      } else {
        //数字无效
        console.log('数字无效'); // cell.setInputValid(false);
      }

      cell.setUserInput(val);
      this.updateCellDom(row, col);
    }
  }, {
    key: "checkAllDone",
    value: function checkAllDone() {
      var cells = this.getCells();

      for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];

        if (cell.getDigStatus()) {
          if (cell.getUserInput() === 0) return false;
          if (!cell.getInputValidStatus()) return false;
        }
      }

      ;
      return true;
    }
  }, {
    key: "getNextDigCell",
    value: function getNextDigCell(row, col) {
      var cells = this.getCells(),
          cell = this.getSingleCell(row, col),
          curIndex = cell.getListIndex();

      for (var i = curIndex + 1; i < cells.length; i++) {
        var item = cells[i];

        if (item.getDigStatus()) {
          return item.getLocation();
        }
      }

      ;
      return false;
    }
  }, {
    key: "updateCellDom",
    value: function updateCellDom(row, col) {
      var index = (row - 1) * 9 + col - 1,
          cellList = this.dom.children[0],
          oldCellNode = cellList.children[index],
          cell = this.getSingleCell(row, col),
          newCellNode = Tools.renderSingleCell(cell);
      cellList.replaceChild(newCellNode, oldCellNode);
    }
    /**
     * 渲染数独表格
     * @param {object} dom 装载数独表格的容器
     */

  }, {
    key: "renderBoard",
    value: function renderBoard(dom) {
      var cells = this.cells;
      var listHtml = document.createElement('ul');
      listHtml.className = 'sudoku-list';
      cells.forEach(function (cell) {
        var cellNode = Tools.renderSingleCell(cell);
        listHtml.appendChild(cellNode);
      });
      dom.innerHTML = '';
      dom.appendChild(listHtml);
      this.dom = dom;
    }
  }]);

  return Board;
}();
/**
 * @class Cell 数独的单个元素/格子
 */


var Cell =
/*#__PURE__*/
function () {
  /**
   * 格子构造函数
   * @param {number} row 行坐标
   * @param {number} col 列坐标
   * @param {number} val 数值
   */
  function Cell(row, col, val) {
    _classCallCheck(this, Cell);

    this.row = row;
    this.col = col;
    this.value = val;
    this.used = new NumberUsed();
    this.userInput = 0;
    this.isDigged = false;
    this.focus = false;
    this.inputValid = true;
    this.index = (row - 1) * 9 + col - 1;
  } //获取当前格子的坐标


  _createClass(Cell, [{
    key: "getLocation",
    value: function getLocation() {
      return [this.row, this.col];
    } //获取当前格子的数值

  }, {
    key: "getValue",
    value: function getValue() {
      return this.value;
    } //设置当前格子的数值

  }, {
    key: "setValue",
    value: function setValue(val) {
      this.value = val;
      this.used.addUsed(val);
    }
  }, {
    key: "getUserInput",
    value: function getUserInput() {
      return this.userInput;
    }
  }, {
    key: "setUserInput",
    value: function setUserInput(val) {
      this.userInput = val;
    }
  }, {
    key: "getDigStatus",
    value: function getDigStatus() {
      return this.isDigged;
    }
  }, {
    key: "setDigStatus",
    value: function setDigStatus(bool) {
      this.isDigged = bool;
    }
  }, {
    key: "toggleFocus",
    value: function toggleFocus() {
      this.focus = !this.focus;
    }
  }, {
    key: "getFocus",
    value: function getFocus() {
      return this.focus;
    }
  }, {
    key: "getInputValidStatus",
    value: function getInputValidStatus() {
      return this.inputValid;
    }
  }, {
    key: "setInputValid",
    value: function setInputValid(bool) {
      this.inputValid = bool;
    }
  }, {
    key: "getListIndex",
    value: function getListIndex() {
      return this.index;
    }
  }]);

  return Cell;
}();
/**
 * @class NumberUsed 记录格子使用过的数字
 */


var NumberUsed =
/*#__PURE__*/
function () {
  function NumberUsed() {
    _classCallCheck(this, NumberUsed);

    this.used = [];
  } //获取当前格子使用过的数字列表


  _createClass(NumberUsed, [{
    key: "getUsedList",
    value: function getUsedList() {
      return this.used;
    }
    /**
     * 添加一个使用过的数字
     * @param {number} num 使用的数字
     * @returns {array} 使用过的数字列表
     */

  }, {
    key: "addUsed",
    value: function addUsed(num) {
      this.used.push(num);
      return this.used;
    } //删除上一个使用过的数字

  }, {
    key: "removeLastUsed",
    value: function removeLastUsed() {
      this.used.pop();
      return this.used;
    } //清除使用记录

  }, {
    key: "clearUsed",
    value: function clearUsed() {
      this.used.length = 0;
    }
  }]);

  return NumberUsed;
}();
/**
 * @class Tools 工具方法的集合
 */


var Tools =
/*#__PURE__*/
function () {
  function Tools() {
    _classCallCheck(this, Tools);
  }

  _createClass(Tools, null, [{
    key: "getBasicList",
    //基础数组
    //获取基础数组的副本
    value: function getBasicList() {
      return _toConsumableArray(this.basicList);
    }
    /**
     * 获取一个随机数，默认返回1~9的随机数
     * @param {number} top 随机数最大值，默认9
     * @param {number} fromZero 是否从零开始，默认false从1开始，设为true可返回随机索引值
     * @returns {number} 生成的随机数
     */

  }, {
    key: "getRandomNum",
    value: function getRandomNum() {
      var top = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 9;
      var fromZero = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return parseInt(Math.random() * (top - 0.1)) + (fromZero ? 0 : 1);
    }
    /**
     * 生成包含1~9随机顺序的数组
     * @returns {array}
     */

  }, {
    key: "getRandomOrderValues",
    value: function getRandomOrderValues() {
      var basicList = this.getBasicList();
      var newList = [];

      while (basicList.length > 0) {
        var randomIdnex = this.getRandomNum(basicList.length, true);
        var randomItem = basicList.splice(randomIdnex, 1)[0];
        newList.push(randomItem);
      }

      ;
      return newList;
    }
    /**
     * 提取一组格子的值
     * @param {array} cellList 格子数组
     * @param {boolean} isInput 是不是用户输入，如果是，优先返回输入数据
     * @returns {array}
     */

  }, {
    key: "getValueList",
    value: function getValueList(cellList) {
      var isInput = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var row = arguments.length > 2 ? arguments[2] : undefined;
      var col = arguments.length > 3 ? arguments[3] : undefined;
      return cellList.map(function (cell) {
        if (isInput) {
          var _cell$getLocation = cell.getLocation(),
              _cell$getLocation2 = _slicedToArray(_cell$getLocation, 2),
              cellRow = _cell$getLocation2[0],
              cellCol = _cell$getLocation2[1];

          if (row === cellRow && col === cellCol) return 0;
          return cell.getDigStatus() ? cell.getUserInput() : cell.getValue();
        } else {
          return cell.getValue();
        }
      });
    }
    /**
     * 根据数独规则，计算指定坐标格子的可用数字
     * @param {number} row 行坐标
     * @param {number} col 列坐标
     * @param {object} table 所在数独表格对象
     * @param {boolean} isInput 是不是用户输入的情况
     * @returns {array} 可用数字列表
     */

  }, {
    key: "getValidNums",
    value: function getValidNums(row, col, table) {
      var isInput = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var rowList = table.getRowList(row),
          colList = table.getColList(col),
          squreList = table.getSqureList(row, col);
      var rowListVal = this.getValueList(rowList, isInput, row, col),
          colListVal = this.getValueList(colList, isInput, row, col),
          squreListVal = this.getValueList(squreList, isInput, row, col);
      var basicList = this.getBasicList();
      var cellUsed = isInput ? [] : table.getSingleCell(row, col).used.getUsedList();
      return basicList.filter(function (item) {
        return !rowListVal.includes(item) && !colListVal.includes(item) && !squreListVal.includes(item) && !cellUsed.includes(item);
      });
    }
    /**
     * 填充指定行数字
     * @param {object} table 所在数独表格对象
     * @param {number} row 行坐标
     * @returns {number} 下一个操作的行坐标，【上一行】 或 【下一行】
     */

  }, {
    key: "fillRow",
    value: function fillRow(table, row) {
      table.clearRangeList(row, 1, row, 9); //清空当前行

      var col = 1;

      while (col <= 9) {
        var validNums = this.getValidNums(row, col, table, false),
            len = validNums.length; // console.log(`坐标 (${row}, ${col}) 的可用值有`, validNums);

        if (len > 0) {
          var randomIndex = this.getRandomNum(len - 1, true);
          table.setSingleCell(row, col, validNums[randomIndex]);
          col++;
        } else {
          if (col === 1) {
            //如果是本行第一个格子，返回操作【上一行】
            table.clearRangeList(row, 1, row, 9); //清空当前行

            return row - 1;
          } else {
            //返回上一个格子
            table.clearRangeList(row, col, row, col); //清空当前格子

            col--;
          }
        }
      }

      ; //本行填充完成，操作【下一行】

      return row + 1;
    }
  }, {
    key: "renderSingleCell",
    value: function renderSingleCell(cell) {
      var cellNode = document.createElement('li');

      var value = cell.getValue(),
          _cell$getLocation3 = cell.getLocation(),
          _cell$getLocation4 = _slicedToArray(_cell$getLocation3, 2),
          row = _cell$getLocation4[0],
          col = _cell$getLocation4[1];

      if (value === 0) cellNode.classList.add('zero-cell');
      if (cell.getFocus()) cellNode.classList.add('focus');

      if (cell.getDigStatus()) {
        var userInput = cell.getUserInput();
        value = userInput || '';
        cellNode.classList.add('digged-cell');
      }

      ;
      if (row === 3 || row === 6) cellNode.classList.add('bold-bottom');
      if (row === 4 || row === 7) cellNode.classList.add('bold-top');
      if (col === 3 || col === 6) cellNode.classList.add('bold-right');
      if (col === 4 || col === 7) cellNode.classList.add('bold-left');
      cellNode.classList.add('base-cell');
      cellNode.classList.add(cell.getInputValidStatus() ? 'input-valid' : 'input-invalid');
      cellNode.innerText = value;
      cellNode.setAttribute('data-location', "".concat(row, "-").concat(col));
      cellNode.setAttribute('data-type', 'cell');
      return cellNode;
    }
  }]);

  return Tools;
}();

_defineProperty(Tools, "basicList", [1, 2, 3, 4, 5, 6, 7, 8, 9]);

var Sodoku =
/*#__PURE__*/
function () {
  function Sodoku(dom) {
    _classCallCheck(this, Sodoku);

    var table = new Board();
    var panel = new NumberPanel();
    table.init();
    table.renderBoard(dom); // table.renderBoard(document.getElementById('answer'));

    this.dom = dom;
    this.table = table;
    this.panel = panel;
  }
  /**
   * 对完整的数独进行挖空
   * @param {number} level 难度等级 ---------- 暂时没用，未掌握数独定级算法
   *      1-简单 
   *      2-普通 
   *      3-困难
   */


  _createClass(Sodoku, [{
    key: "digBoard",
    value: function digBoard(level) {
      var keepCount = 3;
      var table = this.table;

      for (var row = 1; row <= 9; row++) {
        var keepColList = [];

        for (var j = 0; j < keepCount; j++) {
          var randomCol = Tools.getRandomNum(9 - j, false);
          keepColList.push(randomCol);
        }

        ;

        for (var col = 1; col <= 9; col++) {
          if (!keepColList.includes(col)) {
            table.digSingleCell(row, col);
          }
        }
      }
    }
  }, {
    key: "updateDom",
    value: function updateDom() {
      this.table.renderBoard(this.dom);
    }
  }, {
    key: "gameStart",
    value: function gameStart() {
      var _this = this;

      var dom = this.dom; // let btnsDom = document.getElementById('btns');

      dom.addEventListener('click', function (e) {
        var target = e.target;
        var type = target.getAttribute('data-type');

        switch (type) {
          case 'cell':
            var _target$getAttribute$ = target.getAttribute('data-location').split('-').map(function (item) {
              return Number(item);
            }),
                _target$getAttribute$2 = _slicedToArray(_target$getAttribute$, 2),
                row = _target$getAttribute$2[0],
                col = _target$getAttribute$2[1];

            _this.table.handleInputFocus(row, col);

            break;

          case 'btn':
            var inputNum = target.getAttribute('data-value');

            _this.table.handleUserInput(inputNum);

            break;

          default:
            console.log('点击无效区域');
            break;
        }
      });
      this.panel.init(dom);
    }
  }]);

  return Sodoku;
}();

var NumberPanel =
/*#__PURE__*/
function () {
  function NumberPanel() {
    _classCallCheck(this, NumberPanel);

    var list = [];

    for (var i = 1; i <= 9; i++) {
      var btn = new NumberButton(i);
      list.push(btn);
    }

    ;
    this.buttons = list;
  }

  _createClass(NumberPanel, [{
    key: "init",
    value: function init(dom) {
      var list = this.buttons;
      var container = document.createElement('ul');
      list.forEach(function (btn) {
        var btnNode = document.createElement('li');
        btnNode.classList.add('btn');
        btnNode.classList.add('base-cell');
        btnNode.innerText = btn.getNum();
        btnNode.setAttribute('data-value', btn.getNum());
        btnNode.setAttribute('data-type', 'btn');
        container.appendChild(btnNode);
      });
      container.classList.add('number-btns');
      dom.appendChild(container);
    }
  }]);

  return NumberPanel;
}();

var NumberButton =
/*#__PURE__*/
function () {
  function NumberButton(num) {
    _classCallCheck(this, NumberButton);

    this.num = num;
  }

  _createClass(NumberButton, [{
    key: "getNum",
    value: function getNum() {
      return this.num;
    }
  }]);

  return NumberButton;
}();

window.onload = function () {
  var appContainer = document.getElementById('app');
  var game = new Sodoku(appContainer);
  game.digBoard();
  game.updateDom();
  game.gameStart();
  console.log(game);
};