import {
  Component,
  TemplateRef,
  ViewChild,
  Input,
  ElementRef,
  AfterViewInit,
  HostListener,
  OnInit,
  OnDestroy,
  AfterContentInit,
} from "@angular/core";
import { CampaignCenterService } from "../../services/campaigncenter.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  BsModalService,
  BsModalRef,
} from "../../../../node_modules/ngx-bootstrap";
import { Observable, fromEvent, Subscription } from "rxjs";
import { takeUntil, pairwise, switchMap } from "rxjs/operators";

@Component({
  selector: "app-thankyou-scratch",
  templateUrl: "./thankyou-scratch.component.html",
  styleUrls: ["./thankyou-scratch.component.scss"],
})
export class ThankyouScratchComponent
  implements OnInit, AfterViewInit, AfterContentInit, OnDestroy
{
  website: any;
  public container = document.getElementById("js-container");
  private image: HTMLImageElement = new Image();
  modalRef: BsModalRef;
  @ViewChild("participat", { static: false }) template: TemplateRef<any>;
  @ViewChild("canvas_box", { static: false }) public canvas: ElementRef;
  @ViewChild("img", { static: false }) img: ElementRef;
  @ViewChild("wincon", { static: false }) wincont: ElementRef;

  // setting a width and height for the canvas
  @Input() public width = 800;
  @Input() public height = 675;
  public canvasHeight: any;
  public canvasWidth: any;
  src: string;
  private ctx: CanvasRenderingContext2D;
  canvasEl: HTMLCanvasElement;
  displayStyle: string;
  loadStyle: string;
  wincontainer: any;
  topnumber: any;
  leftnumber: any;
  widthnumber: any;
  heightnumber: any;
  firstClientX: any;
  firstClientY: any;
  clientX: any;
  clientY: any;
  scratchSubscription: Subscription;

  contentHeight: number;

  constructor(
    private campaignCenterService: CampaignCenterService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService
  ) {
    if (window.innerWidth < 575) {
      // console.log('phone');
      this.width = 300;
      this.height = 435;
      this.src = "../assets/img/scratch/scratchPhone.jpg";
    } else if (window.innerWidth < 767) {
      // console.log('tablet');
      this.width = 560;
      this.height = 675;
      this.src = "../assets/img/scratch/scratchTablet.jpg";
    } else {
      // console.log('pc');
      this.width = 800;
      this.height = 675;
      this.src = "../assets/img/scratch/scratchDesktop.jpg";
    }
    this.image.src = this.src;
    this.canvasWidth = this.width;
    this.canvasHeight = this.height;

    this.displayblock();
    this.loadnone();
  }
  ngOnInit() {
    // Set body fixed
    // document.querySelector('body').setAttribute('style','position:fixed;top:0');
    // this.campaignCenterService.footerSecondary = true;

    window.scroll(0, 0);
    setTimeout(() => {
      this.updateOffset();
    }, 50);
  }
  public ngAfterViewInit() {
    this.canvasEl = this.canvas.nativeElement;
    this.ctx = this.canvasEl.getContext("2d");
  }
  ngAfterContentInit() {
    setTimeout(() => {
      this.updateOffset();
    }, 50);
  }
  @HostListener("window:resize", [])
  onWindowResize() {
    window.scroll(0, 0);
    this.updateOffset();
  }
  updateOffset(): void {
    this.wincontainer = this.wincont.nativeElement.getBoundingClientRect();
    this.topnumber =
      this.wincontainer.top +
      window.pageYOffset -
      document.documentElement.clientTop;
    this.leftnumber =
      this.wincontainer.left +
      window.pageXOffset -
      document.documentElement.clientLeft;
    this.widthnumber = this.wincontainer.width;
    this.heightnumber = this.wincontainer.height;

    this.canvasEl.style.width = this.widthnumber + 0 + "px";
    this.canvasEl.style.height = this.heightnumber + 0 + "px";

    this.canvasEl.width = this.canvasEl.offsetWidth;
    this.canvasEl.height = this.canvasEl.offsetHeight;

    this.canvasWidth = this.canvasEl.width;
    this.canvasHeight = this.canvasEl.height;

    if (window.innerWidth < 575) {
      // console.log('phone');
      this.src = "../assets/img/scratch/scratchPhone.jpg";
    } else if (window.innerWidth < 767) {
      // console.log('tablet');
      this.src = "../assets/img/scratch/scratchTablet.jpg";
    } else {
      // console.log('pc');
      this.src = "../assets/img/scratch/scratchDesktop.jpg";
    }

    // this.src = "../assets/img/scratch/scratchDesktop.png?";

    this.image.src = this.src;
    // this.ctx.drawImage(this.image, 0, 0);
    this.ctx.drawImage(this.image, 0, 0, this.canvasWidth, this.canvasHeight);
    this.captureEvents(this.canvasEl);
  }
  openModal(participat: TemplateRef<any>) {
    this.modalRef = this.modalService.show(participat);
  }
  anotherCode() {
    if (this.campaignCenterService.pubid) {
      this.router.navigate(["/entercode"], { relativeTo: this.route });
    }
  }
  onDone() {
    // clear up
    this.campaignCenterService.pubid = "";
    // this.campaignCenterService.footerSecondary = false;
    this.router.navigate(["/home"], { relativeTo: this.route });
  }
  afterLoading() {
    this.ctx.drawImage(this.image, 0, 0, this.canvasWidth, this.canvasHeight);
    // this.loadblock();
  }
  displayblock() {
    this.displayStyle = "displayblock";
  }
  displaynone() {
    this.displayStyle = "displaynone";
  }
  loadblock() {
    this.loadStyle = "displayblock";
  }
  loadnone() {
    this.loadStyle = "displaynone";
  }
  touchStart(e) {
    this.firstClientX = e.touches[0].clientX;
    this.firstClientY = e.touches[0].clientY;
  }
  preventTouch(e) {
    const minValue = 5; // threshold
    this.clientX = e.touches[0].clientX - this.firstClientX;
    this.clientY = e.touches[0].clientY - this.firstClientY;
    // Vertical scrolling does not work when you start swiping horizontally.
    if (Math.abs(this.clientX) > minValue) {
      //   console.log('prevention happening', Math.abs(this.clientX), minValue);
      e.preventDefault();
      e.returnValue = false;
      return false;
    }
  }
  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    this.scratchSubscription = fromEvent(canvasEl, "mousedown")
      .pipe(
        switchMap((e) => {
          this.loadblock();
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, "mousemove").pipe(
            // we'll stop (and unsubscribe) once the user releases the mouse
            // this will trigger a 'mouseup' event
            takeUntil(fromEvent(canvasEl, "mouseup")),
            // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
            takeUntil(fromEvent(canvasEl, "mouseleave")),
            // pairwise lets us get the previous value to draw a line from
            // the previous point to the current point
            pairwise()
          );
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top,
        };
        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top,
        };
        this.drawOnCanvas(prevPos, currentPos);
        this.handlePercentage(this.getFilledInPixels(32));
      });
    // this will capture all touch start events from the canvas element
    this.scratchSubscription = fromEvent(canvasEl, "touchstart")
      .pipe(
        switchMap((e) => {
          this.loadblock();
          // after a mouse down, we'll record all touch moves
          return fromEvent(canvasEl, "touchmove").pipe(
            // we'll stop (and unsubscribe) once the user releases the mouse
            // this will trigger a 'touchend' event
            takeUntil(fromEvent(canvasEl, "touchend")),
            // we'll also stop (and unsubscribe) once the touch cancel the canvas (event)
            takeUntil(fromEvent(canvasEl, "touchcancel")),
            // pairwise lets us get the previous value to draw a line from
            // the previous point to the current point
            pairwise()
          );
        })
      )
      .subscribe((res1: [TouchEvent, TouchEvent]) => {
        const rect1 = canvasEl.getBoundingClientRect();
        const prevPos = {
          x: res1[0].touches[0].clientX - rect1.left,
          y: res1[0].touches[0].clientY - rect1.top,
        };
        const currentPos = {
          x: res1[1].touches[0].clientX - rect1.left,
          y: res1[1].touches[0].clientY - rect1.top,
        };
        this.drawOnCanvas(prevPos, currentPos);
        this.handlePercentage(this.getFilledInPixels(32));
      });
  }
  private getFilledInPixels(stride) {
    //  to check the filled pixel
    // console.log('inside getFilledInPixels', stride);
    if (!stride || stride < 1) {
      stride = 1;
    }
    const pixels = this.ctx.getImageData(
      0,
      0,
      this.canvasWidth,
      this.canvasHeight
    );
    const pdata = pixels.data;
    const l = pdata.length;
    const total = l / stride;
    let count = 0;
    // Iterate over all pixels
    for (let i = (count = 0); i < l; i += stride) {
      if (pdata[i] === 0) {
        count++;
      }
    }
    // console.log(count,l,Math.round((count / total) * 100));
    return Math.round((count / total) * 100);
  }
  private handlePercentage(filledInPixels) {
    // after the certain percentage clear the scratch card image canvas
    filledInPixels = filledInPixels || 0;
    // console.log(filledInPixels + '%');
    if (filledInPixels > 45) {
      if (this.ctx.canvas.parentNode !== null) {
        this.ctx.canvas.parentNode.removeChild(this.ctx.canvas);
        this.displayblock();
      }
    }
  }
  private drawOnCanvas(
    prevPos: { x: number; y: number },
    currentPos: { x: number; y: number }
  ) {
    // console.log('inside drawOnCanvas');
    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.lineWidth = 100; // size of brush
    this.ctx.lineJoin = this.ctx.lineCap = "round"; // method of bush
    if (!this.ctx) {
      return;
    }
    this.ctx.beginPath();
    if (prevPos) {
      //   console.log(prevPos.x, prevPos.y, currentPos.x, currentPos.y);
      this.ctx.moveTo(prevPos.x, prevPos.y);
      this.ctx.lineTo(currentPos.x, currentPos.y);
      this.ctx.stroke();
      //   prevPos.x = currentPos.x;
      //   prevPos.y = currentPos.y;
    }
  }

  ngOnDestroy() {
    // this will remove event lister when this component is destroyed
    this.scratchSubscription.unsubscribe();
  }
}
