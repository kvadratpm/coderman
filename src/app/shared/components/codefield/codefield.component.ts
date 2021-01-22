import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as ace from 'ace-builds';

@Component({
  selector: 'app-codefield',
  templateUrl: './codefield.component.html',
  styleUrls: ['./codefield.component.scss']
})
export class CodefieldComponent implements AfterViewInit {

  @ViewChild('editor') private editor!: ElementRef<HTMLElement>;

  aceEditor!: any;

  constructor() { }

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

}
