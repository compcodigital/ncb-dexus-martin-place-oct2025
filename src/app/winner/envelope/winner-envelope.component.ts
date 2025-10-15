import { Component, OnInit, Renderer2, ElementRef, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { CampaignCenterService } from '../../services/campaigncenter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from '../../../../node_modules/ngx-bootstrap';

@Component({
  selector: 'app-winner-envelope',
  templateUrl: './winner-envelope.component.html',
  styleUrls: ['./winner-envelope.component.scss']
})
export class WinnerEnvelopeComponent implements OnInit, AfterViewInit {
  envStyle: string;
  boxStyle: string;
  flipStyle: string;
  clickStyle: string;
  prizeInfo: string;
  prizeInfoName: string;
  prizeInfoRetailer: string;
  inx: number;
  elements: any;
  website: any;
  modalRef: BsModalRef;
  status: boolean;
  @ViewChild('envelopetag', { static: false }) envelopeEl: ElementRef;
  @ViewChild('letter', { static: false }) letterEl: ElementRef;
  @ViewChild('participat', { static: false }) template: TemplateRef<any>;
  constructor(
    private renderer: Renderer2,
    private elem: ElementRef,
    private campaignCenterService: CampaignCenterService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService) {
  }

  ngOnInit() {
    this.clickStyle = 'displayblock';
    this.status = false;
    this.inx = 0;
    if (this.campaignCenterService.prizeInfo && this.campaignCenterService.prizeInfoName) {
      this.prizeInfo = this.campaignCenterService.prizeInfo;
      this.prizeInfoName = this.campaignCenterService.prizeInfoName;
      this.prizeInfoRetailer = this.campaignCenterService.prizeInfoRetailer;
      // console.log('On Winner page, prizeInfo = ' + this.prizeInfo);
      // console.log('On Winner page, prizeInfoName = ' + this.prizeInfoName);
      // console.log('On Winner page, prizeInfoRetailer = ' + this.prizeInfoRetailer);
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
    // this.campaignCenterService.prizeInfo='';
    // this.campaignCenterService.prizeInfoName='';
    // this.campaignCenterService.prizeInfoRetailer='';
    this.router.navigate(['/finish'], { relativeTo: this.route });
  }
}
