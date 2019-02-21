class Timer {
    constructor() {
        this.startTime = new Date();
        this.endTime = new Date();
        this.hourTextNode = null;
        this.minTextNode = null;
        this.secTextNode = null;
        this.stopId = 0;
    }
    init(dom) {
        let hourTextNode = document.createElement('span'),
            minTextNode = document.createElement('span'),
            secTextNode = document.createElement('span'),
            splitor1 = document.createElement('span'),
            splitor2 = null;
        hourTextNode.className = 'timer hour';
        minTextNode.className = 'timer min';
        secTextNode.className = 'timer sec';
        splitor1.className = 'timer splitor';
        splitor1.innerText = ' : ';
        splitor2 = splitor1.cloneNode(true);
        [hourTextNode, splitor1, minTextNode, splitor2, secTextNode].forEach(node => dom.appendChild(node));
        this.hourTextNode = hourTextNode;
        this.minTextNode = minTextNode;
        this.secTextNode = secTextNode;
        this.renderTime(0);
    }
    startTimer() {
        this.startTime = new Date();
        this.stopId = this.tickTimer();
    }
    endTimer() {
        clearInterval(this.stopId);
    }
    tickTimer() {
        return setInterval(() => {
            let nowTime = new Date();
            let time = nowTime - this.startTime;
            this.renderTime(time);
        }, 100);
    }
    resetTimer() {
        this.renderTime(0);
    }
    formatTime(time = 0) {
        let sec = parseInt(time / 1000 % 60),
            min = parseInt(time / 1000 / 60 % 60),
            hour = parseInt(time / 1000 / 60 / 60);
        return {hour, min, sec};
    }
    renderTime(time) {
        let {hour, min, sec} = this.formatTime(time);
        this.hourTextNode.innerText = hour > 9 ? hour : `0${hour}`;
        this.minTextNode.innerText = min > 9 ? min : `0${min}`;
        this.secTextNode.innerText = sec > 9 ? sec : `0${sec}`;
    }
}
export default Timer;