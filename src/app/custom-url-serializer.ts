import { UrlSerializer, UrlTree, DefaultUrlSerializer } from "@angular/router";

export class CustomUrlSerializer implements UrlSerializer {
  parse(url: any): UrlTree {
    if (url.indexOf("claimform") != -1) {
      url = url.replace(/=/gi, "%3D");
    }

    let dus = new DefaultUrlSerializer();
    return dus.parse(url);
  }
  serialize(tree: UrlTree): any {
    let dus = new DefaultUrlSerializer(),
      path = dus.serialize(tree);

    if (path.indexOf("claimform") != -1) {
      path = path.replace(/%3D/gi, "=");
    }

    return path;
  }
}
