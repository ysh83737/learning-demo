class Timer {
    constructor() {
        this.startTime = new Date();
        this.endTime = null;
    }
    startTimer() {
        this.startTime = new Date();
    }
    endTimer() {
        let endTime = new Date(),
            startTime = this.startTime;
        let timeSpend = endTime - startTime;
        this.endTime = endTime;
        return  
    }
    formatTime(time = 0) {
        let sec = parseInt(time / 1000 % 60),
            min = parseInt(time / 1000 / 60 % 60),
            hour = parseInt(time / 1000 / 60 / 60);
        return [hour, min, sec];
    }
}