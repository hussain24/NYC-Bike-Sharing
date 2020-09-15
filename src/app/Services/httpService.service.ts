import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/internal/operators";

@Injectable()
export class httpService{

constructor(private http: HttpClient) {

}
  /* Get Method implementation */
  public GetRequest(url: string, responseType: any = 'json') {

    return this.http.get(url , {
      observe: 'response',
      responseType: responseType
    }).pipe(
      map(response => {
        return response.body;
      })
    );
  }

}