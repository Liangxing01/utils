console.log(111);
console.log(312421412);


const byteSchedule = (urls, limit, calllback) => {
    const schdule = (arr, max, singleCall) => {
        return singleCall(arr.shift()).then((res) => {
            if (arr.length) {
                return schdule(arr);
            } else {
                return 'finish'
            }
        })
    }

    const arr2 = [];

    while(limit--) {
        arr2.push(schdule(urls));
    }
}


export class Node {
    constructor(ele) {
        this.element = ele;
        this.next = undefined;
    }
}

class Link {
    constructor() {
        this.count = 0;
        this.head = undefined;
    }

    push(ele) {
        var node = new Node(ele);
        if (this.head) {
            let current = this.head;

            whilte(current.next) {
                current = current.next;
            }

            current.next = node;
        } else {
            this.head = node;
        }

        this.count++;
    }

    insert(element, position) {
        var node = new Node(element);
        if (position === 0) {
            let old = this.head;
            this.head = node;
            node.next = old;
        } else if (position > this.count) {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = node;
        } else {
            let current = this.head;
            for (let i = 1, i < position; i++) {
                current = current.next;
            }
            let old = current.next;
            current.next = node;
            node.next = old;
        }

        this.count++;
    }

    getElementAt(index) {
        if (index < 0) {
            return undefined;
        }
        let num = 0;
        if (index > this.count) {
            num = this.count;
        }
        let current = this.head;
        while(num--) {
            current = current.next;
        }

        return current;
    }

    remove(element) {

    }
}


class Set {
    constructor() {
        this.list = {};
    }

    add(element) {
        if (this.list[element]) {
            return undefined;
        } else {
            this.list[element] = element;
        }
    }
}