import {OnInit, ViewChildren} from '@angular/core';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as ace from 'ace-builds';
import helps from './json/helps.json';

@Component({
  selector: 'app-codefield',
  templateUrl: './codefield.component.html',
  styleUrls: ['./codefield.component.scss']
})
export class CodefieldComponent implements OnInit, AfterViewInit {

  @ViewChild('editor') private editor!: ElementRef<HTMLElement>;

  currentLevel = Number(/\d+/.exec(this.router.url)); // TODO: Создать интерфейс, принимаемые значения - keyof Helps
  currentHelp = 0; // TODO: Создать интерфейс, принимаемые значения - keyof Helps.CurrentLevel
  isCommand = false;
  isRotate = false;
  isAction = false;
  isCycleControl = false;
  aceEditor!: any;
  helps: { [index: string]: {[index: string]: string} } = helps; // TODO: Создать интерфейс Helps
  @ViewChildren('interactiveLighting') navElements: any;
  isMoveControl = false;
  moveLimit: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  cycleLimit: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  levels: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  isPopupActive = true;
  isWin = false;
  isLose = false;
  popupTopic = `Задание №${this.currentLevel}`;
  popupText = this.helps[this.currentLevel][0];
  popupButtonInnerText = 'Начать выполнение';
  isWelcome = false;
  lastWinLevel = 0;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    ace.config.set('basePath', 'https://unpkg.com/ace-builds@1.4.12/src-noconflict');
    this.aceEditor = ace.edit(this.editor.nativeElement);
    this.aceEditor.setReadOnly(false);
    this.aceEditor.setTheme('ace/theme/twilight');
    this.aceEditor.setOptions({
      fontFamily: 'tahoma',
      fontSize: '20pt'
    });
    this.changeProgressLevel();
    this.navElements = this.navElements.toArray();
    if (localStorage.getItem('lastWinLevel')) {
      this.lastWinLevel = parseInt(localStorage.getItem('lastWinLevel') as string, 10);
    } else {
      localStorage.setItem('lastWinLevel', String(this.lastWinLevel));
    }
    localStorage.setItem('currentLevel', String(this.currentLevel));
  }

  updateEditor(event: string): void {
    this.aceEditor.insert(`${event}\n`, false);

  }

  get code(): string[] {
    console.log(this.aceEditor.getValue())
    return this.aceEditor.getValue().split('\n');
  }

  changeLevel(levelNumber: number | string): void {
    if (typeof levelNumber === 'string') {
      this.currentLevel = parseInt(levelNumber, 10);
    } else {
      this.currentLevel = levelNumber;
    }
    this.changeProgressLevel();
    this.openWelcomePopup();
    this.aceEditor.setValue('', 0);
  }

  changeHelp(): void {
    const amountHelps = Object.keys(this.helps[this.currentLevel]).length;
    this.currentHelp = (this.currentHelp + 1) % amountHelps;
  }

  changeProgressLevel(): void {
    if (this.navElements) {
        this.navElements.forEach((e: any) => {
          const el = e.nativeElement;
          const numberElem = parseInt(el.innerText, 10);
          console.log(numberElem === this.currentLevel);
          el.classList.toggle('nav-elem__previous', numberElem < this.currentLevel);
          el.classList.toggle('nav-elem__active', numberElem === this.currentLevel);
        });
      }
  }

  actionControl(e: any): void {
    if (e.target.closest('.button__level1')) {
      this.isCommand = !this.isCommand;
      if (!this.isCommand) {
        this.isRotate = false;
        this.isMoveControl = false;
        this.isAction = false;
        this.isCycleControl = false;
      }
    } else if (e.target.closest('.button__level2')) {
      const buttonLevel2 = e.target.closest('.button__level2');
      if (buttonLevel2.innerText === 'Rotate') {
        this.isRotate = !this.isRotate;
        this.isMoveControl = false;
        this.isAction = false;
        this.isCycleControl = false;
      } else if (buttonLevel2.innerText === 'Move') {
        this.isMoveControl = !this.isMoveControl;
        this.isRotate = false;
        this.isAction = false;
        this.isCycleControl = false;
      } else if (buttonLevel2.innerText === 'Actions') {
        this.isAction = !this.isAction;
        this.isRotate = false;
        this.isMoveControl = false;
        this.isCycleControl = false;
      } else if (buttonLevel2.innerText === 'Loop') {
        this.isCycleControl = !this.isCycleControl;
        this.isRotate = false;
        this.isMoveControl = false;
        this.isAction = false;
      }
    }
  }

  resetControl(e: any): void {
    if (e.target.closest('.controllers-wrapper')) {
      return;
    } else {
      this.isCommand = false;
      this.isRotate = false;
      this.isMoveControl = false;
      this.isAction = false;
      this.isCycleControl = false;
    }
  }


  changeRoute(item: number | string, isWinSwap = false): void {
    if (item === 'exit') {
      this.router.navigate(['']);
      return;
    }
    if (isWinSwap) {
      localStorage.setItem('lastWinLevel', String(this.currentLevel));
      this.changeLevel(item);
      localStorage.setItem('currentLevel', String(this.currentLevel));
      this.router.navigate([`level${item}`]);
    } else if (item > this.lastWinLevel + 1) {
      return;
    } else {
      this.changeLevel(item);
      this.router.navigate([`level${item}`]);
    }
  }
  closePopup(): void {
    this.isPopupActive = false;
    this.isWelcome = false;
    if (this.isWin) {
      this.isWin = false;
      const nextLevel = this.currentLevel + 1;
      this.changeRoute(nextLevel, true);
    } else if (this.isLose) {
      this.isLose = false;
    }
  }

  openLosePopup(): void {
    this.isPopupActive = true;
    this.isLose = true;
    this.popupText = 'Не расстраивайся! Просто попробуйте еще раз!';
    this.popupTopic = `Поражение...`;
    this.popupButtonInnerText = 'Повторить';
  }
  openWinPopup(): void {
    this.isPopupActive = true;
    this.isWin = true;
    this.popupText = 'Отлично! Ты большой молодец, продолжайте в том же духе!';
    this.popupTopic = `Победа!`;
    this.popupButtonInnerText = 'Продолжить';
  }
  openWelcomePopup(): void {
    this.isPopupActive = true;
    this.isWelcome = true;
    this.popupText = this.helps[this.currentLevel][0];
    this.popupTopic = `Задание №${this.currentLevel}`;
    this.popupButtonInnerText = 'Начать выполнение';
  }

  addLoop(item: number): void {
    const loop = `loop ${item}\n\nend`;
    this.updateEditor(loop);
    const row = this.aceEditor.session.getLength() - 2;
    const col = this.aceEditor.session.getLine(row).length;
    this.aceEditor.gotoLine(row, col);
  }

  reset(): void {
    this.aceEditor.setValue('');
  }

}
