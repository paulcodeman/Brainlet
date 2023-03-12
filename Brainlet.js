function convertToNumber(str) {
  // Проверяем, является ли строка числом
  if (/^-?\d*\.?\d+$/.test(str)) {
    // Преобразуем строку в число и возвращаем его
    return Number(str);
  }
  // Если строка не является числом, возвращаем ее как есть
  return str;
}

class BrainLang {
  constructor() {
    this.memory = new Array(100).fill(0); // инициализация памяти
    this.pointer = 0; // указатель на текущую ячейку памяти
    this.stack = []; // стек для хранения адресов начала циклов
    this.buffer = '';
    this.stringEnable = false;
    this.integerEnable = false;
  }

  run(code) {
    let i = 0;

    while (i < code.length) {
      switch (code[i]) {
        case '>':
          this.pointer++;
          break;
        case '<':
          this.pointer--;
          break;
        case '+':
          this.memory[this.pointer] = this.memory[this.pointer-1]+this.memory[this.pointer];
          break;
        case '-':
          this.memory[this.pointer] = this.memory[this.pointer-1]-this.memory[this.pointer];
          break;
        case '*':
          this.memory[this.pointer] = this.memory[this.pointer-1]*this.memory[this.pointer];
          break;
        case '/':
          this.memory[this.pointer] = this.memory[this.pointer-1]/this.memory[this.pointer];
          break;
        case '.':
          document.write(this.memory[this.pointer]);
          break;
        case ',':
          this.memory[this.pointer] = convertToNumber(prompt('Введите текст'));
          break;
        case '[':
          if (this.memory[this.pointer] === 0) {
            let counter = 1;
            while (counter > 0) {
              i++;
              if (code[i] === '[') counter++;
              else if (code[i] === ']') counter--;
            }
          } else {
            this.stack.push(i);
          }
          break;
        case ']':
          if (this.memory[this.pointer] !== 0) {
            i = this.stack[this.stack.length - 1];
          } else {
            this.stack.pop();
          }
          break;
        default:
          if (code[i] == '"') {
              if (this.stringEnable) {
                this.memory[this.pointer] = this.buffer;
                this.buffer = '';
              }
              this.stringEnable = !this.stringEnable;
            }
            else if (this.stringEnable) {
              this.buffer += code[i++];
              continue;
            }
            else if (/\d/.test(code[i])) {
              let num = '';
              while (/\d/.test(code[i])) {
                num += code[i++];
              }
              this.memory[this.pointer] = parseInt(num);
              continue;
            }
          break;
      }
      i++;
    }
  }
}

// Пример использования

const code = ',>,*.';

const vm = new BrainLang();
vm.run(code);
