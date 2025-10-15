import { Component, OnInit, Renderer2, ElementRef, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignCenterService } from '../../services/campaigncenter.service';
import { BsModalService, BsModalRef } from '../../../../node_modules/ngx-bootstrap';

@Component({
  selector: 'app-thankyou-envelope',
  templateUrl: './thankyou-envelope.component.html',
  styleUrls: ['./thankyou-envelope.component.scss']
})
export class ThankyouEnvelopeComponent implements OnInit, AfterViewInit {
  envStyle: string;
  boxStyle: string;
  flipStyle: string;
  clickStyle: string;
  inx: number;
  elements: any;
  website: any;
  modalRef: BsModalRef;
  status: boolean;
  closeDate: Date;
  today: Date;
  adaybeforeclosedate: boolean;//used to check a day before the close date
  @ViewChild('envelopetag', { static: false }) envelopeEl: ElementRef;
  @ViewChild('letter', { static: false }) letterEl: ElementRef;
  @ViewChild('participat', { static: false }) template: TemplateRef<any>;
  constructor(
    private renderer: Renderer2,
    private elem: ElementRef,
    private campaignCenterService: CampaignCenterService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.clickStyle = 'displayblock';
    this.status = false;
    this.inx = 0;
    this.adaybeforeclosedate = true;
    this.closeDateCheck();
  }
  closeDateCheck() {
    this.closeDate = new Date("9 Feburary 2020 00:00:00");//
    this.today = new Date();
    console.log(this.closeDate.getTime(), this.today.getTime());
    if (this.today.getTime() >= this.closeDate.getTime()) {
      this.adaybeforeclosedate = false;
      console.log(this.adaybeforeclosedate);
    }
  }
  ngAfterViewInit() {
    // you'll get your through 'elements' below code
    // setTimeout(() => this.envelopeEl.nativeElement.focus());
    // this.envelopeEl.nativeElement.scrollIntoView();
    this.elements = this.elem.nativeElement.querySelectorAll('.fold').length;
    // console.log(this.elements);
  }
  openenv() {
    console.log('openfunction');
    if (this.status === false) {
      console.log('open card');
      this.envStyle = ' moveEnvelope';
      this.status = true;
      setTimeout(() => {
        if (this.status === true) {
          this.envStyle += ' opened env_large';
          this.clickStyle = 'displaynone';
          setTimeout(() => {
            this.envStyle += ' timedelay ';
            // this.letterEl.nativeElement.scrollIntoView();
            // this.unfold(this.elements,this.inx);
          }, 3000);
        }
      }, 1000);
      //   setTimeout(()=>{
      //     if(this.status==true){
      //     this.boxStyle = ' boxIndex';
      // // this.letterEl.nativeElement.scrollIntoView();
      //     // this.unfold(this.elements,this.inx);
      //     }
      //     else{
      //       this.boxStyle = ' ';
      //     }
      //   }, 4000);
    }
    // else {
    //   console.log('close card');
    //   this.envStyle = ' ';
    //   this.clickStyle = 'displayblock';
    //   this.status = false;
    // }
  }
  unfold(elem, inx) {
    if (inx !== elem) {

      console.log('index: ' + inx);
      inx = inx + 1;
      console.log('index: ' + inx);
      setTimeout(() => {
        // this.flipStyle = 'unfolded';
        this.unfold(elem, inx);
      }, 500);
    }
  }
  closeenv() {
    console.log('closefunction');
    this.envStyle = 'close';
    this.flipStyle = 'fold';
  }
  openModal(participat: TemplateRef<any>) {
    this.modalRef = this.modalService.show(participat);
  }
  anotherCode() {
    if (this.campaignCenterService.pubid) {
      this.router.navigate(['/entercode'], { relativeTo: this.route });
    }
  }
  onDone() {
    // clear up
    localStorage.removeItem('prize_info');
    localStorage.removeItem('prize_info_name');
    localStorage.removeItem('prize_info_retailer');
    this.campaignCenterService.pubid = '';
    this.router.navigate(['/home'], { relativeTo: this.route });
  }
}
