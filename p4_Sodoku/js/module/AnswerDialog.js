class AnswerDialog {
    constructor() {
        this.dom = null;
        this.container = null;
    }
    init(dom) {
        let container = document.createElement('div');
        dom.className = 'answer-table';
        container.className = 'answer-container';
        dom.appendChild(container);
        this.dom = dom;
        this.container = container;
        dom.addEventListener('click', () => {
            this.toggleAnswerShow();
        });
    }
    updateAnswer(table) {
        table.renderBoard(this.container, true);
    }
    getShowStatus() {
        return this.show;
    }
    toggleAnswerShow() {
        let classList = this.dom.classList,
            isShow = classList.contains('show');
        classList[isShow ? 'remove' : 'add']('show');
    }
}
export default AnswerDialog;