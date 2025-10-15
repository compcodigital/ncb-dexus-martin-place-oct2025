import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CampaignCenterService } from './campaigncenter.service';

@Injectable()
export class VerifiedRouteGuard implements CanActivate {
  constructor(
    private campaignCenterService: CampaignCenterService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const code = next.params.codeQR ? next.params.codeQR : null;
      this.campaignCenterService.codeQR = code ? code.substring(0,5) : '';

      console.log(this.campaignCenterService.codeQR);
      
    return true;
  }
}
