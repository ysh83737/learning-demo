import Tools from './Tools';
import Board from './Board';
import NumberPanel from './NumberPanel';
import UserInerfacePanel from './UserInerfacePanel';
import Timer from './Timer';
import AnswerDialog from './AnswerDialog';

class Sodoku {
    constructor(dom) {
        this.dom = dom;
        this.init(dom);
        this.level = 1;
    }
    init(dom) {
        let table = null,
            panel = new NumberPanel(),
            userInerface = new UserInerfacePanel(),
            timer = new Timer(),
            answer = new AnswerDialog();
        let tableContainer = document.createElement('div'),
            numberPanelContainer = document.createElement('div'),
            userInerfaceContainer = document.createElement('div'),
            timerContainer = document.createElement('div'),
            answerContainer = document.createElement('div');
        dom.appendChild(tableContainer);
        dom.appendChild(numberPanelContainer);
        dom.appendChild(userInerfaceContainer);
        dom.appendChild(timerContainer);
        dom.appendChild(answerContainer);
        this.tableContainer = tableContainer;
        this.numberPanelContainer = numberPanelContainer;
        this.userInerfaceContainer = userInerfaceContainer;
        this.answerContainer = answerContainer;
        answer.init(answerContainer);
        this.answer = answer;
        table = this.getNewGame();
        panel.init(numberPanelContainer, table.handleUserInput.bind(table));
        userInerface.init(userInerfaceContainer, this.handleUserInterface.bind(this));
        timer.init(timerContainer);
        this.panel = panel;
        this.userInerface = userInerface;
        this.timer = timer;
    }
    getNewGame(level = 1) {
        let table = new Board();
        table.init();
        this.answer.updateAnswer(table);
        table.digBoard(level);
        table.renderBoard(this.tableContainer);
        this.table = table;
        return table;
    }
    gameStart() {
        this.timer.startTimer();
        this.userInerface.changStatus(2);
        this.table.setClickable(true);
    }
    gameStop() {
        this.timer.endTimer();
        this.userInerface.changStatus(3);
        this.table.setClickable(false);
    }
    gameNext() {
        this.getNewGame(this.level);
        this.userInerface.changStatus(1);
    }
    gameReset() {
        this.userInerface.changStatus(1);
        this.table.resetAllInput();
        this.table.renderBoard(this.tableContainer);
        this.timer.resetTimer();
        this.table.setClickable(false);
    }
    showAnswer() {
        this.answer.toggleAnswerShow();
    }
    handleUserInterface(id) {
        switch (id) {
            case 'start':
                this.gameStart();
                break;
            case 'next':
                this.gameNext();
                break;
            case 'level':
                //暂不调难度
                break;
            case 'stop':
                this.gameStop();
                break;
            case 'reset':
                this.gameReset();
                break;
            case 'answer':
                this.showAnswer();
                break;
        }
    }
}
export default Sodoku;