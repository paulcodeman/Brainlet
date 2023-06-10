function convertToNumber(str) {
    if (/^-?\d+(\.\d+)?$/.test(str)) {
        return parseFloat(str); // Используем parseFloat для преобразования строки в число с плавающей точкой
    }
    return str;
}

class Brainlet {
    constructor() {
        this.memory = Array(100).fill([0, 0]); // Используем fill для заполнения массива значениями [0, 0]
        this.pointer = 0;
        this.stack = [];
        this.buffer = '';
        this.string = false;
        this.block = false;
        this.global = {};
        this.memory[0] = [0, 0];
    }

    push(value) {
        const stack = this.memory[this.pointer];
        stack[0]++;
        stack.push(value); // Используем метод push для добавления значения в конец массива
    }

    pop() {
        const stack = this.memory[this.pointer];
        if (stack[0] > 0) {
            stack[0]--;
            return stack.pop(); // Используем метод pop для извлечения последнего значения из массива
        }
        return null;
    }

    merge(value1, value2) {
        const mergedArray = [...value1, ...value2.slice(2)]; // Используем операторы расширения и срез для объединения массивов
        mergedArray[0] = value1[0] + value2[0];
        return mergedArray;
    }

    run(code) {
        let command = '';
        let temp = '';

        code += ' ';

        for (let i = 0; i < code.length; i++) {
            const symbol = code[i];
            if (symbol === '"') {
                this.string = !this.string;
            } else if (symbol === '{') {
                this.block = true;
            } else if (symbol === '}') {
                this.block = false;
            }
            if (this.string || this.block) {
                temp += symbol;
            } else if (symbol === ' ' || symbol === "\n" || symbol === "\r") {
                if (/^-?\d+(\.\d+)?$/.test(command)) {
                    this.push(parseFloat(command));
                } else if (/^".*$/.test(temp)) {
                    this.push(temp.substring(1));
                    temp = '';
                } else if (/^{.*$/.test(temp)) {
                    this.push(temp.substring(1));
                    temp = '';
                } else {
                    switch (command) {
                        case 'set':
                            const name = this.pop();
                            this.global[name] = this.memory[this.pointer];
                            this.memory[this.pointer] = [0, 0];
                            break;
                        case 'get':
                            this.memory[this.pointer] = this.merge(this.memory[this.pointer], this.global[this.pop()]);
                            break;
                        case '+':
                        case '-':
                        case '*':
                        case '/':
                        {
                            const stack = this.memory[this.pointer];
                            let ret = stack[2];
                            for (let j = 1; j < stack[0]; j++) {
                                const item = stack[j+2];
                                if (command === '+') {
                                    ret += item;
                                } else if (command === '*') {
                                    ret *= item;
                                } else if (command === '-') {
                                    ret -= item;
                                } else if (command === '/') {
                                    ret /= item;
                                }
                            }
                            this.memory[this.pointer] = [1, 0, ret];
                            break;
                        }
                        case '.':
                            console.log(this.memory[this.pointer]);
                            break;
                        case ',':
                            this.push(convertToNumber(prompt('Введите текст')));
                            break;
                        default:
                            this.push(command);
                    }
                }

                command = '';
            } else {
                command += symbol;
            }
        }
    }
}



// Пример использования

const code = ', name set "Hello " name get + .';

const vm = new Brainlet();
vm.run(code);
