import Tools from './Tools';
import Board from './Board';
import NumberPanel from './NumberPanel';
import UserInerfacePanel from './UserInerfacePanel';

class Sodoku {
    constructor(dom) {
        this.dom = dom;
        this.init(dom);
        this.startTime = null;
        this.endTime = null;
    }
    init(dom) {
        let table = new Board();
        let panel = new NumberPanel();
        let userInerface = new UserInerfacePanel(this);
        let tableContainer = document.createElement('div'),
            numberPanelContainer = document.createElement('div'),
            userInerfaceContainer = document.createElement('div');
        table.init();
        table.renderBoard(tableContainer);
        panel.init(numberPanelContainer, table.handleUserInput.bind(table));
        userInerface.init(userInerfaceContainer, this.handleUserInterface);
        dom.appendChild(tableContainer);
        dom.appendChild(numberPanelContainer);
        dom.appendChild(userInerfaceContainer);

        this.tableContainer = tableContainer;
        this.numberPanelContainer = numberPanelContainer;
        this.userInerfaceContainer = userInerfaceContainer;
        this.table = table;
        this.panel = panel;
    }
    /**
     * 对完整的数独进行挖空
     * @param {number} level 难度等级 ---------- 暂时没用，未掌握数独定级算法
     *      1-简单 -每行保留4格
     *      2-普通 -每行保留3格
     *      3-困难 -每行保留2格
     */
    digBoard(level = 1) {
        let keepCount = 5 - level;
        let table = this.table;
        for (let row = 1; row <= 9; row++) {
            let keepColList = [];
            for (let j = 0; j < keepCount; j++) {
                let randomCol = Tools.getRandomNum(9, false);
                while (keepColList.includes(randomCol)) {
                    randomCol = Tools.getRandomNum(9, false);
                };
                keepColList.push(randomCol);
            };
            for (let col = 1; col <= 9; col++) {
                if (!keepColList.includes(col)) {
                    table.digSingleCell(row, col);
                }
            }
        }
    }
    updateDom() {
        this.table.renderBoard(this.tableContainer);
    }
    gameStart() {
        // let dom = this.dom;
        // dom.addEventListener('click', (e) => {
        //     let target = e.target;
        //     let type = target.getAttribute('data-type');
        //     console.log('type', type);
        //     switch (type) {
        //         case 'cell':
        //             let [row, col] = target.getAttribute('data-location').split('-').map(item => Number(item));
        //             this.table.handleInputFocus(row, col);
        //             break;
        //         case 'btn':
        //             let inputNum = target.getAttribute('data-value');
        //             this.table.handleUserInput(inputNum);
        //             break;
        //         default:
        //             console.log('点击无效区域');
        //             break;
        //     }
        // });
        
    }
    handleUserInterface(id) {
        const typeList = ['start', 'next', 'level', 'stop', 'reset', 'answer'];
        const typeName = ['开始', '换一个', '难度', '停止', '重置', '答案'];
        console.log('按键回调', id);
        // switch (id) {
        //     case 'start':
        //         this.startTime = new Date();
        //         this.gameStart();
        //         break;
        //     case 'next':
                
        //         break;
        //     case 'level':
                
        //         break;
        //     case 'stop':
                
        //         break;
        //     case 'reset':
                
        //         break;
        //     case 'answer':
                
        //         break;
        // }
    }
}
export default Sodoku;