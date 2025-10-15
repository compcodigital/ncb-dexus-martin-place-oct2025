import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import {
  FormControl,
  FormGroup,
  Validators,
  FormArray,
  FormBuilder,
} from "@angular/forms";
import { CampaignCenterService } from "../services/campaigncenter.service";
import { ErrorMsg } from "../shared/errorMsg";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"],
})
export class WelcomeComponent implements OnInit {
  @ViewChild("serverErrorCode", { static: false })
  serverErrorCode: TemplateRef<any>;
  @ViewChild("verifyAgeTemplate", { static: false })
  verifyAgeTemplate: TemplateRef<any>;

  modalRef: BsModalRef;

  buttonDisabled: boolean; // used to avoid the duplicate submissions
  loadingStyle: string;
  countries: any;
  countryKey: string;
  countryName: string;
  countryIcon: string;
  countryCatg: string;

  welcomeForm: FormGroup;
  validField: any = [];
  validFieldString: boolean;
  invalidField: any = [];
  invalidFieldString: boolean;
  printField: any = [];
  acc: string; //check auto complete browser

  errorMsg = new ErrorMsg();
  birthdatedd: string;
  birthdatemm: string;
  birthdateyy: string;

  isBirthdatedd: boolean;
  isBirthdatemm: boolean;
  isBirthdateyy: boolean;

  birthdateddStyle: string;
  birthdatemmStyle: string;
  birthdateyyStyle: string;

  displayStyle: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private campaignCenterService: CampaignCenterService
  ) {
    this.countries = [
      {
        key: "aus",
        name: "Australia",
        icon: "../../assets/img/australia.png",
        catg: "spirits",
      },
      // {
      //   key: "usa",
      //   name: "United States Of America",
      //   icon: "../../assets/img/united-states.png",
      //   catg: "spirits",
      // },
    ];
    this.countryKey = this.countries[0].key;
    this.countryCatg = this.countries[0].catg;

    this.campaignCenterService.countryIso3 = this.countries[0].key;
  }
  ngOnInit() {
    console.log("Page Welcome");
    this.checkAuto();
    this.initForm();
    this.buttonDisabled = false;
    this.loadingStyle = "displaynone";
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
    this.isBirthdatedd = true;
    this.isBirthdatemm = true;
    this.isBirthdateyy = true;

    this.welcomeForm = this.fb.group({
      birthdatedd: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.maxLength(2),
        Validators.minLength(2),
      ]),
      birthdatemm: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.maxLength(2),
        Validators.minLength(2),
      ]),
      birthdateyy: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.maxLength(4),
        Validators.minLength(4),
      ]),
    });
  }
  validCheck() {
    this.validField = [];
    this.invalidField = [];
    this.printField = [];

    if (this.isBirthdatedd) {
      this.validField.push(
        this.welcomeForm.controls.birthdatedd.status === "VALID"
      );
      this.invalidField.push(
        this.welcomeForm.controls.birthdatedd.status === "INVALID"
      );
      this.printField.push("birthdatedd");
      this.printField.push(this.welcomeForm.controls.birthdatedd.status);
    }
    if (this.isBirthdatemm) {
      this.validField.push(
        this.welcomeForm.controls.birthdatemm.status === "VALID"
      );
      this.invalidField.push(
        this.welcomeForm.controls.birthdatemm.status === "INVALID"
      );
      this.printField.push("birthdatemm");
      this.printField.push(this.welcomeForm.controls.birthdatemm.status);
    }
    if (this.isBirthdateyy) {
      this.validField.push(
        this.welcomeForm.controls.birthdateyy.status === "VALID"
      );
      this.invalidField.push(
        this.welcomeForm.controls.birthdateyy.status === "INVALID"
      );
      this.printField.push("birthdateyy");
      this.printField.push(this.welcomeForm.controls.birthdateyy.status);
    }
  }
  onSubmit() {
    this.buttonDisabled = true;
    this.loadingStyle = "displayinlineblock";

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
      this.loadingStyle = "displaynone";
      this.errorMsg.message +=
        "\nPlease enter your birthdate.";

      if (this.isBirthdatedd) {
        if (this.welcomeForm.controls.birthdatedd.status === "INVALID") {
          this.errorMsg.valid = false;
          // this.errorMsg.message += "\nWe need your birthdate day.";
          this.errorMsg.type = "birthdatedd";
          this.birthdateddStyle = "error-msg";
        } else {
          this.birthdateddStyle = "success-msg";
        }
      }
      if (this.isBirthdatemm) {
        if (this.welcomeForm.controls.birthdatemm.status === "INVALID") {
          this.errorMsg.valid = false;
          // this.errorMsg.message += "\nWe need your birthdate month.";
          this.errorMsg.type = "birthdatemm";
          this.birthdatemmStyle = "error-msg";
        } else {
          this.birthdatemmStyle = "success-msg";
        }
      }
      if (this.isBirthdateyy) {
        if (this.welcomeForm.controls.birthdateyy.status === "INVALID") {
          this.errorMsg.valid = false;
          // this.errorMsg.message += "\nWe need your birthdate year.";
          this.errorMsg.type = "birthdateyy";
          this.birthdateyyStyle = "error-msg";
        } else {
          this.birthdateyyStyle = "success-msg";
        }
      }
    }

    if (this.validFieldString) {
      console.log("valid", this.printField);
      this.buttonDisabled = false;
      this.loadingStyle = "displaynone";

      let yy = this.welcomeForm.controls.birthdateyy.value;
      let mm = this.welcomeForm.controls.birthdatemm.value;
      let dd = this.welcomeForm.controls.birthdatedd.value;

      // Jamet review
      if(dd < 10 && dd.toString().length < 2) {
        dd = "0"+dd;
      }

      if(mm < 10 && mm.toString().length < 2) {
        mm = "0"+mm;
      }

      let birthdate = yy + "-" + mm + "-" + dd;
      this.campaignCenterService.birthdate = birthdate;

      this.errorMsg.message = "";
      if (
        yy.toString().length < 4 ||
        (mm.toString() > 9 && mm.toString().length < 2) || // Jamet revisar
        (dd.toString() > 9 && dd.toString().length < 2) // Jamet revisar
      ) {
        console.log("birthdate invalid 1");
        this.errorMsg.valid = false;
        this.errorMsg.message += "\nThe birthdate entered is incorrect.";
      } else if (!this.isYYYYMMDD(birthdate)) {
        console.log("birthdate invalid 2");
        this.errorMsg.valid = false;
        this.errorMsg.message += "\nThe birthdate entered is incorrect.";
      } else {
        this.successClass();

        this.loadingStyle = "displayinlineblock";
        this.buttonDisabled = true;

        this.campaignCenterService
          .verifyAge(birthdate, this.countryKey, this.countryCatg)
          .subscribe(
            (response) => {
              console.log("verifyAge", response);
              if (response) {
                this.router.navigate(["/home"], { relativeTo: this.route });
              } else {
                // this.openModal(this.verifyAgeTemplate, "sm");
                window.location.href = "https://drinkwise.org.au/";
              }
              this.loadingStyle = "displaynone";
              this.buttonDisabled = false;
            },
            (error) => {
              console.log(error);
              this.loadingStyle = "displaynone";
              this.buttonDisabled = false;
              this.openModal(this.serverErrorCode, "sm");
            }
          );
      }
    } else {
      console.log("Not Valid", this.printField);
      this.buttonDisabled = false;
      this.loadingStyle = "displaynone";
      return;
    }

    // let birthDate = "";
  }
  keyupbirthdatedd(event) {
    const keyword = event.target.value.trim();
    if (keyword.length == 2) {
      document.getElementById("focusbirthdatemm").focus();
    }
  }
  keyupbirthdatemm(event) {
    const keyword = event.target.value.trim();
    if (keyword.length == 2) {
      document.getElementById("focusbirthdateyy").focus();
    }
  }
  validateOnlyNumeric(evt, type = "") {
    var theEvent = evt || window.event;
    // validate length
    if (type == "yyyy") {
      if (theEvent.target.value.length == 4) {
        theEvent.returnValue = false;
      }
    } else {
      if (theEvent.target.value.length == 2) {
        theEvent.returnValue = false;
      }
    }
    // Handle paste
    if (theEvent.type === "paste") {
      // key = event.clipboardData.getData('text/plain');
    } else {
      // Handle key press
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
    }
  }
  isYYYYMMDD(date) {
    let isValidDate = Date.parse(date);
    if (isNaN(isValidDate)) {
      return false;
    }
    return true;
  }
  selectCountry(key, name, icon, catg) {
    this.countryKey = key;
    this.countryName = name;
    this.countryIcon = icon;
    this.countryCatg = catg;

    this.campaignCenterService.countryIso3 = key;
  }
  successClass() {
    this.birthdateddStyle = "success-msg";
    this.birthdatemmStyle = "success-msg";
    this.birthdateyyStyle = "success-msg";
    this.errorMsg.valid = true;
    this.errorMsg.message = "";
    this.errorMsg.type = "";
  }
  displayblock() {
    this.displayStyle = "displayblock";
  }
  displaynone() {
    this.displayStyle = "displaynone";
  }
  openModal(template: TemplateRef<any>, size = "lg") {
    let modalCss = { class: "modal-dialog-centered modal-" + size };
    this.modalRef = this.modalService.show(template, modalCss);
  }
}
