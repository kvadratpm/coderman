import { OnInit } from '@angular/core';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as ace from 'ace-builds';
import helps from './json/helps.json';

@Component({
  selector: 'app-codefield',
  templateUrl: './codefield.component.html',
  styleUrls: ['./codefield.component.scss']
})
export class CodefieldComponent implements OnInit, AfterViewInit {

  @ViewChild('editor') private editor!: ElementRef<HTMLElement>;

  currentLevel = 1; // TODO: Создать интерфейс, принимаемые значения - keyof Helps
  currentHelp = 0; // TODO: Создать интерфейс, принимаемые значения - keyof Helps.CurrentLevel
  isCommand = false;
  isRotate = false;
  aceEditor!: any;
  helps: { [index: string]: {[index: string]: string} } = helps; // TODO: Создать интерфейс Helps
  navElements: NodeListOf<Element> | undefined;
  isMoveControl = false;
  moveLimit: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  levels: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    console.log(this.helps);
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
  }

  updateEditor(event: string): void {
    this.aceEditor.insert(`${event}\n`, false);
    this.aceEditor.navigateFileEnd();
  }

  get code(): string[] {
    return this.aceEditor.getValue().split('\n');
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

  changeRoute(item: number): void {
    this.router.navigate([`level-${item}`])
  }
}
