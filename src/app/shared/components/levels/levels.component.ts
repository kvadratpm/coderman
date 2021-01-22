import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as ace from 'ace-builds';
import helps from './json/helps.json';


@Component({
  selector: 'app-levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.scss']
})
export class LevelsComponent implements OnInit, AfterViewInit {
  constructor() { }
  currentLevel = 0;
  currentHelp = 0;
  isCommand = false;
  isRotate = false;
  aceEditor: ace.Ace.Editor | undefined;
  helps: { [index: string]: {[index: string]: string} } = helps;
  navElements: NodeListOf<Element> | undefined;
  isMoveControl = false;
  moveLimit: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];



  ngOnInit(): void {
    ace.config.set('fontSize', '20px');
    ace.config.set('basePath', 'https://unpkg.com/ace-builds@1.4.12/src-noconflict');
    this.aceEditor = ace.edit('editor');
    this.aceEditor.setReadOnly(false);
    this.aceEditor.setTheme('ace/theme/terminal');
    const href = window.location.href;
    this.currentLevel = parseInt(href[href.length - 1], 10);
  }
  ngAfterViewInit(): void {
    this.navElements = document.querySelectorAll('.nav-elem__inner-circle');
    this.changeProgressLevel();
  }

  updateEditor(event: string): void {
    if (this.aceEditor) {
      this.aceEditor.insert(`${event}\n`, false);
      this.aceEditor.navigateFileEnd();
    }
}

  changeLevel(e: any): void {
    if (e.target.closest('.nav-elem')) {
      const href = window.location.href;
      this.currentLevel = parseInt(href[href.length - 1], 10);
      this.changeProgressLevel();
    }
  }
  changeHelp(): void {
    const amountHelps = Object.keys(this.helps[this.currentLevel]).length;
    console.log(amountHelps);
    this.currentHelp = (this.currentHelp + 1) % amountHelps;
  }
changeProgressLevel(): void {
    if (this.navElements) {
      this.navElements.forEach((el: any) => {
        const numberElem = parseInt(el.innerText, 10);
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
      }
    } else if (e.target.closest('.button__level2')) {
      const buttonLevel2 = e.target.closest('.button__level2');
      if (buttonLevel2.innerText === 'Rotate') {
        this.isRotate = !this.isRotate;
        this.isMoveControl = false;
      } else if (buttonLevel2.innerText === 'Move') {
        this.isMoveControl = !this.isMoveControl;
        this.isRotate = false;
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
    }
  }
}



