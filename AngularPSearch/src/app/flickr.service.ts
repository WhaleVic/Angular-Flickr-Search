import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

export interface FlickrPhoto {
  farm: string;
  id: string;
  secret: string;
  server: string;
  title: string;
}

export interface FlickrOutput {
  photos: {
    photo: FlickrPhoto[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class FlickrService {
  private prevKeyword: string = '';
  private currPage: number = 1;

  constructor(private http: HttpClient) { }

  search_keyword(
    keyword: string,
    tags: string = '',
    minUploadDate: string = '',
    maxUploadDate: string = ''
  ): Observable<{ url: string; title: string }[]> {
    if (this.prevKeyword === keyword) {
      this.currPage++;
    } else {
      this.currPage = 1;
    }
    this.prevKeyword = keyword;

    const url = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&';
    let params = `api_key=${environment.flickr.key}&text=${keyword}&format=json&nojsoncallback=1&per_page=12&page=${this.currPage}`;

    if (tags) {
      params += `&tags=${tags}`;
    }
    if (minUploadDate) {
      params += `&min_upload_date=${new Date(minUploadDate).getTime() / 1000}`;
    }
    if (maxUploadDate) {
      params += `&max_upload_date=${new Date(maxUploadDate).getTime() / 1000}`;
    }

    return this.http.get<FlickrOutput>(url + params).pipe(
      map((res: FlickrOutput) => {
        const urlArr: { url: string; title: string }[] = [];
        res.photos.photo.forEach((ph: FlickrPhoto) => {
          const photoObj = {
            url: `https://farm${ph.farm}.staticflickr.com/${ph.server}/${ph.id}_${ph.secret}.jpg`,
            title: ph.title
          };
          urlArr.push(photoObj);
        });
        return urlArr;
      })
    );
  }
}