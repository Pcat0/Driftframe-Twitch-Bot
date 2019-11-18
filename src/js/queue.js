const EventEmitter = require('events');

class Queue extends EventEmitter {
    constructor() {
        super();
        this.queue = [];
    }
    indexOf(indexer){
        for (let i = 0; i < this.queue.length; i++) {
            if(this.queue[i].indexer === indexer) {
                return i
            }
        }
        return -1;
    }

    add(indexer, data) {
        var newItem = { indexer: indexer, data: data};
        var newIndex = this.queue.push(newItem);
        this.emit("change", "add", newIndex, newItem);
    }
    
}



module.exports = Queue;
