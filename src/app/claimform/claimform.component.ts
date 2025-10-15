import {
  Component,
  OnInit,
  ElementRef,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { Location, DatePipe } from "@angular/common";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { CampaignCenterService } from "../services/campaigncenter.service";
import { Center } from "../shared/center";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ErrorMsg } from "../shared/errorMsg";
import { Retailer } from "../shared/retailer";

@Component({
  selector: "app-claimform",
  templateUrl: "./claimform.component.html",
  styleUrls: ["./claimform.component.scss"],
})
export class ClaimformComponent implements OnInit {
  @ViewChild("serverErrorCode", { static: false }) serverErrorCode: TemplateRef<
    any
  >;
  @ViewChild("errorTokenInvalid", { static: false })
  errorTokenInvalid: TemplateRef<any>;
  title: string;
  errorMsg = new ErrorMsg();

  accName: string;
  accBsb: string;
  accNumber: string;

  isAccName: boolean;
  isAccBsb: boolean;
  isAccNumber: boolean;

  // css style apply
  accNameStyle: string;
  accBsbStyle: string;
  accNumberStyle: string;
  displayStyle: string;
  loadingStyle: string;

  modalRef: BsModalRef;
  claimForm: FormGroup;
  validField: any = [];
  validFieldString: boolean;
  invalidField: any = [];
  invalidFieldString: boolean;
  printField: any = [];
  showPageSuccess: boolean;
  buttonDisabled: boolean;

  acc: string; //check auto complete browser
  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private campaignCenterService: CampaignCenterService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    console.log("Page Claimform");

    this.checkAuto();
    this.initForm();

    this.buttonDisabled = false;
    this.loadingStyle = "displaynone";
    this.title = this.campaignCenterService.campaignTitle;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
    }
  }
  checkAuto() {
    //to make change to autofill function should not be enable used only chrome for now.
    // need to find the solution for other major browsers
    if (navigator.userAgent.indexOf("Chrome") !== -1) {
      this.acc = "no";
    } else {
      this.acc = "off";
    }
  }
  private initForm() {
    this.isAccName = true;
    this.isAccBsb = true;
    this.isAccNumber = true;

    this.claimForm = this.fb.group({
      accName: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-zA-Z.-\\s']*[a-zA-Z]$"),
        Validators.maxLength(250),
      ]),
      accBsb: new FormControl("", [
        Validators.required,
        Validators.pattern("^[-0-9]*$"),
      ]),
      accNumber: new FormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
      ]),
    });
  }

  openModal(template: TemplateRef<any>) {
    const mm = { class: "modal-lg" };
    this.modalRef = this.modalService.show(template, mm);
  }
  displayblock() {
    this.displayStyle = "displayblock";
  }
  displaynone() {
    this.displayStyle = "displaynone";
  }
  backHome() {
    this.router.navigate(["/home"], { relativeTo: this.route });
  }
  validCheck() {
    this.validField = [];
    this.invalidField = [];
    this.printField = [];

    if (this.isAccName) {
      this.validField.push(this.claimForm.controls.accName.status === "VALID");
      this.invalidField.push(
        this.claimForm.controls.accName.status === "INVALID"
      );
      this.printField.push("accName");
      this.printField.push(this.claimForm.controls.accName.status);
    }
    if (this.isAccBsb) {
      this.validField.push(this.claimForm.controls.accBsb.status === "VALID");
      this.invalidField.push(
        this.claimForm.controls.accBsb.status === "INVALID"
      );
      this.printField.push("accBsb");
      this.printField.push(this.claimForm.controls.accBsb.status);
    }
    if (this.isAccNumber) {
      this.validField.push(
        this.claimForm.controls.accNumber.status === "VALID"
      );
      this.invalidField.push(
        this.claimForm.controls.accNumber.status === "INVALID"
      );
      this.printField.push("accNumber");
      this.printField.push(this.claimForm.controls.accNumber.status);
    }
  }
  trimming_fn(x) {
    return x ? x.replace(/^\s+|\s+$/gm, "") : "";
  }
  onSubmit() {
    this.loadingStyle = "displayinlineblock";

    this.claimForm.patchValue({
      accName: this.trimming_fn(this.claimForm.controls.accName.value),
      accBsb: this.trimming_fn(this.claimForm.controls.accBsb.value),
      accNumber: this.trimming_fn(this.claimForm.controls.accNumber.value),
    });

    this.validCheck();

    this.validFieldString = this.validField.every((currentValue) => {
      return currentValue === true;
    });
    this.invalidFieldString = this.invalidField.every((currentValue) => {
      return currentValue === false;
    });

    if (this.invalidFieldString === false) {
      console.log("validating");
      this.errorMsg.valid = false;
      this.errorMsg.message = "";
      this.errorMsg.message +=
        "\nAll fields marked with an asterisk (*) are required.";

      if (this.isAccName) {
        if (this.claimForm.controls.accName.status === "INVALID") {
          this.errorMsg.valid = false;
          this.errorMsg.message += "\nWe need your account name.";
          this.errorMsg.type = "accName";
          this.accNameStyle = "error-msg";
        } else {
          this.accNameStyle = "success-msg";
        }
      }
      if (this.isAccBsb) {
        if (this.claimForm.controls.accBsb.status === "INVALID") {
          this.errorMsg.valid = false;
          this.errorMsg.message += "\nWe need your BSB.";
          this.errorMsg.type = "accountbsb";
          this.accBsbStyle = "error-msg";
        } else {
          this.accBsbStyle = "success-msg";
        }
      }
      if (this.isAccNumber) {
        if (this.claimForm.controls.accNumber.status === "INVALID") {
          this.errorMsg.valid = false;
          this.errorMsg.message += "\nWe need your account number.";
          this.errorMsg.type = "accountnumber";
          this.accNumberStyle = "error-msg";
        } else {
          this.accNumberStyle = "success-msg";
        }
      }
    }

    if (this.validFieldString) {
      console.log("valid", this.printField);
      this.loadingStyle = "displaynone";

      this.successClass();
      this.fulfillmentProvide();

      const elm = document.getElementsByClassName("fit-device")[0];
      elm.scrollTop = 0;
    } else {
      console.log("Not Valid", this.printField);
      this.loadingStyle = "displaynone";
      return;
    }
  }
  fulfillmentProvide() {
    this.loadingStyle = "displayinlineblock";
    this.buttonDisabled = true;

    let hash = this.route.snapshot.params["hash"];

    this.campaignCenterService
      .fulfillmentProvide(
        hash,
        this.claimForm.value.accName,
        this.claimForm.value.accBsb,
        this.claimForm.value.accNumber
      )
      .subscribe(
        (response: any) => {
          if (response.action == "provided") {
            this.showPageSuccess = true;
          } else {
            this.showPageSuccess = false;
            if (response.error && response.error.code == "NCB-0034") {
              this.openModal(this.errorTokenInvalid);
              setTimeout(() => {
                this.backHome();
              }, 5000);
            } else {
              this.openModal(this.serverErrorCode);
            }
          }

          this.loadingStyle = "displaynone";
          this.buttonDisabled = false;
        },
        (error) => {
          console.log(error);
          this.showPageSuccess = false;
          this.loadingStyle = "displaynone";
          this.buttonDisabled = false;
          this.openModal(this.serverErrorCode);
        }
      );
  }
  successClass() {
    this.accNameStyle = "success-msg";
    this.accBsbStyle = "success-msg";
    this.accNumberStyle = "success-msg";

    this.errorMsg.valid = true;
    this.errorMsg.message = "";
    this.errorMsg.type = "";
  }
  anotherCode() {
    if (this.campaignCenterService.pubid) {
      this.router.navigate(["/entercode"], { relativeTo: this.route });
    }
  }
  onDone() {
    // clear up
    this.campaignCenterService.prizeInfo = "";
    this.campaignCenterService.prizeInfoName = "";
    this.campaignCenterService.prizeInfoRetailer = "";
    this.router.navigate(["/home"], { relativeTo: this.route });
  }
}
