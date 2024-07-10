import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor() { }
  imageUrl: any;

  // @ViewChild('modal', {static: true}) modal!: ElementRef;


  open() {
    $('#myModal').modal('show');
  }

  close() {
    $('#myModal').modal('hide');
  }

  ngOnInit(): void {
  }

}
